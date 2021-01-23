package com.server.app.service.userservice;

import com.server.app.domain.User;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.UserServiceSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserRegistration {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private static UserServiceSettings serviceSettings;

    private Logger LOGGER = LoggerFactory.getLogger(UserRegistration.class);

    public ResponseEntity<String> registerUser(String token, UserCredentialsDto userCredentialsDto){
        if(token.length() >= serviceSettings.getAcceptTokenLength()){
            Optional<User> user = userRepository.findLoggedUserByToken(token);
            if(user.isPresent()) {
                return processToUserRegistration(userCredentialsDto);
            }
            LOGGER.warn("Registration failed, token " + token + " expired.");
            return ResponseEntity.badRequest().build();
        }
        LOGGER.warn("Registration failed, token: " + token + " is to short.");
        return ResponseEntity.badRequest().build();
    }

    private ResponseEntity<String> processToUserRegistration(UserCredentialsDto userCredentialsDto){
        if( ! userWithThisEmailExist(userCredentialsDto.getUserEmail())){
            if(userCredentialsDto.getUserPassword().length() >= serviceSettings.getMinimalPasswordLength()) {
                userRepository.save(createNewUser(userCredentialsDto));
                return ResponseEntity.accepted().build();
            }
            LOGGER.warn("Password is to short.");
            return ResponseEntity.badRequest().build();
        }
        LOGGER.warn("User with email : " + userCredentialsDto.getUserEmail() + " exist.");
        return ResponseEntity.badRequest().build();
    }

    private boolean userWithThisEmailExist(String userEmail){
        return userRepository.findByEmail(userEmail).isPresent();
    }

    private User createNewUser(UserCredentialsDto userCredentialsDto){
        return new User(userCredentialsDto.getUserEmail(), userCredentialsDto.getUserPassword(),
                false, "", null, new ArrayList<>());
    }
}
