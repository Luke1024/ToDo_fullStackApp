package com.server.app.service.userservice;

import com.server.app.domain.StringDto;
import com.server.app.domain.Task;
import com.server.app.domain.User;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.UserServiceSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserLogging {

    private Random random = new Random();

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    private Logger LOGGER = LoggerFactory.getLogger(UserLogging.class);

    public ResponseEntity<StringDto> createGuestUserAndGenerateToken(){
        String guestToken = generateToken();
        createGuestUser(guestToken);
        return ResponseEntity.ok(new StringDto(guestToken));
    }

    public ResponseEntity<StringDto> loginUserAndGenerateNewToken(String token, UserCredentialsDto userCredentialsDto) {
        if(token.length()>= serviceSettings.getAcceptTokenLength()){
            Optional<User> userAsGuest = userRepository.findLoggedUserByToken(token);
            if(userAsGuest.isPresent()){
                return processWithUserLogging(userAsGuest.get(), userCredentialsDto);
            } else {
                LOGGER.warn("Logging failed. User with token " + token + " don'exist or logged out.");
                return new ResponseEntity<>(new StringDto("User session expired or logged out."), HttpStatus.BAD_REQUEST);
            }
        }
        LOGGER.warn("Logging failed. Token " + token + " is to short.");
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<StringDto> logoutUser(String token){
        Optional<User> userOptional = userRepository.findLoggedUserByToken(token);
        if(userOptional.isPresent()){
            userOptional.get().setToken("");
            userOptional.get().setLogged(false);
            return ResponseEntity.accepted().build();
        } else {
            LOGGER.warn("Logout failed. User with token " + token + " don't exist or logged out.");
            return new ResponseEntity<>(new StringDto("User session expired or logged out."), HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<StringDto> processWithUserLogging(User userAsGuest, UserCredentialsDto userCredentialsDto){
        Optional<User> userRegistered = loadRegisteredUser(userCredentialsDto);
        if(userRegistered.isPresent()){
            return logInUserAndCopyTasks(userAsGuest, userRegistered.get());
        } else
            LOGGER.warn("User with credentials " + userCredentialsDto.getUserEmail() + " " +
                    userCredentialsDto.getUserPassword() + " not found.");
            return new ResponseEntity<>(new StringDto("User email or password are incorrect or user doeesn't exist."),
                    HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<StringDto> logInUserAndCopyTasks(User userAsQuest, User userRegistered){
        List<Task> questTasks = userAsQuest.getTaskList();
        if( ! questTasks.isEmpty()){
            userRegistered.addTasks(questTasks);
        }
        userRegistered.setLogged(true);
        userRegistered.setSessionActiveTo(LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()));

        String newToken = generateToken();
        userRegistered.setToken(newToken);

        userRepository.save(userRegistered);

        return ResponseEntity.ok(new StringDto(newToken));
    }

    private Optional<User> loadRegisteredUser(UserCredentialsDto userCredentialsDto){
        return userRepository.findUserByEmailAndPassword(userCredentialsDto.getUserEmail(), userCredentialsDto.getUserPassword());
    }

    private void createGuestUser(String questToken){
        userRepository.save(new User( "quest", "", true, questToken,
                LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()), new ArrayList<>()));
    }

    private String generateToken(){
        int leftLimit = 97;
        int rightLimit = 122;
        int targetStringLength = 15;
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }
}
