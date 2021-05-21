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

@Service
public class UserRegistration {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private static UserServiceSettings serviceSettings;

    private Logger LOGGER = LoggerFactory.getLogger(UserRegistration.class);

    private String token;
    private UserCredentialsDto userCredentialsDto;

    public ResponseEntity<StringDto> registerUser(String token, UserCredentialsDto userCredentialsDto){
        loadDataToAnalysis(token, userCredentialsDto);
        if(analyzeToken()){
            if(analyzeCredentials()){
                if(isEmailFreeToUse()){
                    if(findUserByToken()){
                        executeRegistration();
                        return new ResponseEntity<>(new StringDto("User succesfully registered."), HttpStatus.ACCEPTED);
                    } else return new ResponseEntity<>(new StringDto("Session expired."), HttpStatus.BAD_REQUEST);
                } else new ResponseEntity<>(new StringDto("User with this email already exist."), HttpStatus.BAD_REQUEST);
            } else new ResponseEntity<>(new StringDto("Password is too short or there is something with credentials in general."), HttpStatus.BAD_REQUEST);
        } else return new ResponseEntity<>(new StringDto("Token is not valid."), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(new StringDto("Something bad happen."), HttpStatus.BAD_REQUEST);
    }

    private void loadDataToAnalysis(String token, UserCredentialsDto credentialsDto){
        this.token = token;
        this.userCredentialsDto = credentialsDto;
    }

    private boolean analyzeToken(){
        if(token != null){
            return token.length() >= serviceSettings.getAcceptTokenLength();
        } else return false;
    }

    private boolean analyzeCredentials() {
        if(userCredentialsDto != null){
            if(userCredentialsDto.getUserPassword() != null && userCredentialsDto.getUserEmail() != null) {
                if (userCredentialsDto.getUserPassword().length() >= serviceSettings.getMinimalPasswordLength()) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean isEmailFreeToUse(){
        return ! userRepository.findByEmail(this.userCredentialsDto.getUserEmail()).isPresent();
    }

    private boolean findUserByToken(){
        return userRepository.findUserByToken(this.token).isPresent();
    }

    private void executeRegistration(){
        User userToRegister = userRepository.findUserByToken(this.token).get();
        userToRegister.setUserEmail(this.userCredentialsDto.getUserEmail());
        userToRegister.setPassword(this.userCredentialsDto.getUserPassword());
        userRepository.save(userToRegister);
    }
}
