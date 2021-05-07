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
            Optional<User> user = userRepository.findUserByToken(token);
            if(user.isPresent()) {
                return processToUserRegistration(userCredentialsDto, user.get());
            }
            String message = "Registration failed, token " + token + " expired.";
            LOGGER.warn(message);
            return new ResponseEntity<>(new StringDto(message), HttpStatus.BAD_REQUEST);
        }
        LOGGER.warn("Registration failed, token: " + token + " is to short.");
        return new ResponseEntity<>(new StringDto("Token is not valid."), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<StringDto> processToUserRegistration(UserCredentialsDto userCredentialsDto, User user){
        if( ! userWithThisEmailExist(userCredentialsDto.getUserEmail())){
            if(credentialsAnalysis(userCredentialsDto)) {
                if (userCredentialsDto.getUserPassword().length() >= serviceSettings.getMinimalPasswordLength()) {

                    user.registerUser(userCredentialsDto);
                    userRepository.save(user);

                    return new ResponseEntity<>(new StringDto("User registered."), HttpStatus.ACCEPTED);
                } else {
                    LOGGER.warn("Password is to short.");
                    return new ResponseEntity<>(new StringDto("Password is to short."), HttpStatus.BAD_REQUEST);
                }
            } else return new ResponseEntity<>(new StringDto("Problem with user credentials"), HttpStatus.BAD_REQUEST);
        }
        LOGGER.warn("User with email : " + userCredentialsDto.getUserEmail() + " exist.");
        return new ResponseEntity<>(new StringDto("User with this email already exist."), HttpStatus.BAD_REQUEST);
    }

    private boolean userWithThisEmailExist(String userEmail){
        return userRepository.findByEmail(userEmail).isPresent();
    }

    private boolean credentialsAnalysis(UserCredentialsDto credentialsDto){
        if(credentialsDto != null){
            if(credentialsDto.getUserPassword() != null && credentialsDto.getUserEmail() != null){
                return true;
            }
        }
        return false;
    }
}
