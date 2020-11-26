package com.server.app.service;

import com.server.app.domain.UserCredentialsDto;
import com.server.app.service.userservice.UserLogging;
import com.server.app.service.userservice.UserRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class UserService {

    @Autowired
    private UserServiceSettings serviceSettings;

    private Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRegistration userRegistration;

    @Autowired
    private UserLogging userLogging;

    public ResponseEntity registerUser(String token, UserCredentialsDto userCredentialsDto){
        return userRegistration.registerUser(token, userCredentialsDto);
    }

    public ResponseEntity<String> createGuestUserAndGenerateToken(){
        return userLogging.createGuestUserAndGenerateToken();
    }

    public ResponseEntity<String> loginUserAndGenerateNewToken(String token, UserCredentialsDto userCredentialsDto){
        return userLogging.loginUserAndGenerateNewToken(token, userCredentialsDto);
    }

    public ResponseEntity logoutUser(String token){
        return userLogging.logoutUser(token);
    }
}
