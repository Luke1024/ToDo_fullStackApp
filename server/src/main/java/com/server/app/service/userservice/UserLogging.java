package com.server.app.service.userservice;

import com.server.app.domain.Task;
import com.server.app.domain.User;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.UserServiceSettings;
import org.springframework.beans.factory.annotation.Autowired;
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

    public ResponseEntity<String> createGuestUserAndGenerateToken(){
        String guestToken = generateToken();
        createGuestUser(guestToken);
        return ResponseEntity.ok(guestToken);
    }

    public ResponseEntity<String> loginUserAndGenerateNewToken(String token, UserCredentialsDto userCredentialsDto) {
        if(token.length()>= serviceSettings.getAcceptTokenLength()){
            Optional<User> userAsGuest = userRepository.findLoggedUserByToken(token);
            if(userAsGuest.isPresent()){
                return processWithUserLogging(userAsGuest.get(), userCredentialsDto);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<String> logoutUser(String token){
        Optional<User> userOptional = userRepository.findLoggedUserByToken(token);
        if(userOptional.isPresent()){
            userOptional.get().setToken("");
            userOptional.get().setLogged(false);
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    private ResponseEntity<String> processWithUserLogging(User userAsGuest, UserCredentialsDto userCredentialsDto){
        Optional<User> userRegistered = loadRegisteredUser(userCredentialsDto);
        if(userRegistered.isPresent()){
            return logInUserAndCopyTasks(userAsGuest, userRegistered.get());
        } else return ResponseEntity.badRequest().build();
    }

    private ResponseEntity<String> logInUserAndCopyTasks(User userAsQuest, User userRegistered){
        List<Task> questTasks = userAsQuest.getTaskList();
        if( ! questTasks.isEmpty()){
            userRegistered.addTasks(questTasks);
        }
        userRegistered.setLogged(true);
        userRegistered.setSessionActiveTo(LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()));

        String newToken = generateToken();
        userRegistered.setToken(newToken);

        userRepository.save(userRegistered);

        return ResponseEntity.ok(newToken);
    }

    private Optional<User> loadRegisteredUser(UserCredentialsDto userCredentialsDto){
        return userRepository.findUserByEmailAndPassword(userCredentialsDto.getUserEmail(), userCredentialsDto.getUserPassword());
    }

    private void createGuestUser(String questToken){
        userRepository.save(new User( "quest", "", true, questToken,
                LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()), new ArrayList<>()));
    }

    private String generateToken(){
        int leftLimit = 32;
        int rightLimit = 127;
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
