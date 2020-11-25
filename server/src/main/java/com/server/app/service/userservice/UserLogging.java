package com.server.app.service.userservice;

import com.server.app.domain.Task;
import com.server.app.domain.User;
import com.server.app.domain.UserDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.ServiceResponse;
import com.server.app.service.UserServiceSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserLogging {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDtoChecker dtoChecker;

    public String createGuestUserAndGenerateToken(){
        String guestToken = generateToken();
        createGuestUser(guestToken);
        return guestToken;
    }

    public ServiceResponse loginUserAndGenerateNewToken(UserDto userDto) {
        String message = dtoChecker.checkDto(userDto);
        if (message.equals("")) {
            return processWithUserLogging(userDto);
        } else {
            return new ServiceResponse(HttpStatus.BAD_REQUEST, message);
        }
    }

    public ServiceResponse logoutUser(String token){
        Optional<User> userOptional = userRepository.findLoggedUserByToken(token);
        if(userOptional.isPresent()){
            userOptional.get().setToken("");
            userOptional.get().setLogged(false);
            return new ServiceResponse(HttpStatus.OK,"");
        } else {
            return new ServiceResponse(HttpStatus.BAD_REQUEST,"Token is not valid.");
        }
    }

    private ServiceResponse processWithUserLogging(UserDto userDto){
        Optional<User> userAsQuest = loadQuestUser(userDto);
        Optional<User> userRegistered = loadRegisteredUser(userDto);

        String message = "";

        if( ! userAsQuest.isPresent()){
            message += "Token is not actively used.";
        }
        if( ! userRegistered.isPresent()){
            message += "Email or password are not correct.";
        }
        if(message.equals("")){
            return logInUserAndCopyTasks(userAsQuest.get(), userRegistered.get());
        } else return new ServiceResponse(HttpStatus.BAD_REQUEST, message);
    }

    private ServiceResponse logInUserAndCopyTasks(User userAsQuest, User userRegistered){
        List<Task> questTasks = userAsQuest.getTaskList();
        if(questTasks.size()>0){
            userRegistered.addTasks(questTasks);
        }
        userRegistered.setLogged(true);
        userRegistered.setSessionActiveTo(LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()));

        String newToken = generateToken();
        userRegistered.setToken(newToken);

        return new ServiceResponse(HttpStatus.OK, "", newToken);
    }

    private Optional<User> loadQuestUser(UserDto userDto){
        if(userDto != null){
            if(userDto.getUserToken() != null) {
                return userRepository.findLoggedUserByToken(userDto.getUserToken());
            }
        }
        return Optional.empty();
    }

    private Optional<User> loadRegisteredUser(UserDto userDto){
        return userRepository.findUserByEmailAndPassword(userDto.getUserEmail(), userDto.getUserPassword());
    }

    private void createGuestUser(String questToken){
        userRepository.save(new User( "quest", "", true, questToken,
                LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()), new ArrayList<>()));
    }

    private String generateToken(){
        int leftLimit = 32;
        int rightLimit = 127;
        int targetStringLength = 15;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        String generatedString = buffer.toString();
        return generatedString;
    }
}
