package com.server.app.service.userservice;

import com.server.app.domain.StringDto;
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
import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserRegistration {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private static UserServiceSettings serviceSettings;

    private Logger LOGGER = LoggerFactory.getLogger(UserRegistration.class);

    public ResponseEntity<StringDto> registerUser(String token, UserCredentialsDto userCredentialsDto){
        if(token.length() >= serviceSettings.getAcceptTokenLength()){
            Optional<User> user = userRepository.findLoggedUserByToken(token);
            if(user.isPresent()) {
                return processToUserRegistration(userCredentialsDto);
            }
            String message = "Registration failed, token " + token + " expired.";
            LOGGER.warn(message);
            return new ResponseEntity<>(new StringDto("Registration failed, session expired."), HttpStatus.BAD_REQUEST);
        }
        LOGGER.warn("Registration failed, token: " + token + " is to short.");
        return new ResponseEntity<>(new StringDto("Token is not valid."), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<StringDto> processToUserRegistration(UserCredentialsDto userCredentialsDto){
        if( ! userWithThisEmailExist(userCredentialsDto.getUserEmail())){
            if(userCredentialsDto.getUserPassword().length() >= serviceSettings.getMinimalPasswordLength()) {
                userRepository.save(createNewUser(userCredentialsDto));
                return ResponseEntity.accepted().build();
            } else {
                LOGGER.warn("Password is to short.");
                return new ResponseEntity<>(new StringDto("Password is to short."), HttpStatus.BAD_REQUEST);
            }
        }
        LOGGER.warn("User with email : " + userCredentialsDto.getUserEmail() + " exist.");
        return new ResponseEntity<>(new StringDto("User with this email already exist."), HttpStatus.BAD_REQUEST);
    }

    private boolean userWithThisEmailExist(String userEmail){
        return userRepository.findByEmail(userEmail).isPresent();
    }

    private User createNewUser(UserCredentialsDto userCredentialsDto){
        return new User(userCredentialsDto.getUserEmail(), userCredentialsDto.getUserPassword(),
                false, "", null, new ArrayList<>());
    }
}
