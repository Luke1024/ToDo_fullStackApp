package com.server.app.service;

import com.server.app.domain.Task;
import com.server.app.domain.User;
import com.server.app.domain.UserDto;
import com.server.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static int sessionActiveHours = 6;

    private Logger logger = Logger.getLogger(UserService.class.getName());

    public void registerUser(UserDto userDto){

    }

    public String createGuestUserAndGenerateToken(){
        String guestToken = generateToken();
        createGuestUser(guestToken);
        return guestToken;
    }

    public String loginUserAndGenerateNewToken(UserDto userDto){
        Optional<User> userAsQuest = loadQuestUser(userDto);
        Optional<User> userRegistered = loadRegisteredUser(userDto);

        if(userAsQuest.isPresent() && userRegistered.isPresent()) {
            return logInUserAndCopyTasks(userAsQuest.get(), userRegistered.get());
        }
        return "";
    }

    private String logInUserAndCopyTasks(User userAsQuest, User userRegistered){
        List<Task> questTasks = userAsQuest.getTaskList();
        if(questTasks.size()>1){
            userRegistered.addTasks(questTasks);
        }
        userRegistered.setLogged(true);
        userRegistered.setSessionActiveTo(LocalDateTime.now().plusHours(sessionActiveHours));

        String newToken = generateToken();
        userRegistered.setToken(newToken);

        return newToken;
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
        if(userDto != null){
            if(userDto.getUserEmail() != null){
                if(userDto.getUserPassword() != null){
                    return userRepository.findUserByEmailAndPassword(userDto.getUserEmail(), userDto.getUserPassword());
                }
            }
        }
        return Optional.empty();
    }

    private void createGuestUser(String questToken){
        userRepository.save(new User("guest", "", "", true, questToken,
                LocalDateTime.now().plusHours(sessionActiveHours), new ArrayList<>()));
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
        logger.log(Level.INFO, "Token generated: " + generatedString);
        return generatedString;
    }
}
