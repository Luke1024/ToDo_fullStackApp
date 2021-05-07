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
public class UserLogging {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    private Logger LOGGER = LoggerFactory.getLogger(UserLogging.class);

    public ResponseEntity<StringDto> loginUser(String token, UserCredentialsDto userCredentialsDto) {
        if (credentialsAnalysis(userCredentialsDto)) {
            findUserUsingToken(token, userCredentialsDto);
        } else {
            return new ResponseEntity<>(new StringDto("There is problem with user credentials"), HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<StringDto> findUserUsingToken(String token, UserCredentialsDto credentialsDto){
        Optional<User> userAsGuest = findUserByToken(token);
        if (userAsGuest.isPresent()) {
            return findUserWithCredentials(token, userAsGuest.get(), credentialsDto);
        } else {
            LOGGER.warn("Logging failed. User with token " + token + " don'exist or logged out.");
            return new ResponseEntity<>(new StringDto("User session expired or logged out."), HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<StringDto> findUserWithCredentials(String token, User userAsGuest, UserCredentialsDto userCredentialsDto){
        Optional<User> userRegistered = findUserByEmail(userCredentialsDto.getUserEmail());
        if(userRegistered.isPresent()){
            return logInUser(userAsGuest, userRegistered.get(), userCredentialsDto.getUserPassword());
        } else
            LOGGER.warn("User with credentials " + userCredentialsDto.getUserEmail() + " " +
                    userCredentialsDto.getUserPassword() + " not found.");
        return new ResponseEntity<>(new StringDto("User email or password are incorrect or user doeesn't exist."),
                HttpStatus.NOT_FOUND);
    }

    private ResponseEntity<StringDto> logInUser(String token, User userAsQuest, User userRegistered){

        userAsQuest.logOutUser();

        if(userRegistered.logInUser(password, newToken)) {
            userRepository.save(userRegistered);
            return new ResponseEntity<>(new StringDto(newToken), HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(new StringDto("Something went wrong."), HttpStatus.BAD_REQUEST);
        }
    }

    private boolean credentialsAnalysis(UserCredentialsDto credentialsDto){
        if(credentialsDto != null){
            if(credentialsDto.getUserPassword() != null && credentialsDto.getUserEmail() != null){
                return true;
            }
        }
        return false;
    }

    private Optional<User> findUserByToken(String token){
        return userRepository.findUserByToken(token);
    }

    private Optional<User> findUserByEmail(String email){
        return userRepository.findByEmail(userCredentialsDto.getUserEmail());
    }

}
