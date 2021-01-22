package com.server.app.service;

import com.server.app.domain.StringDto;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.service.userservice.UserLogging;
import com.server.app.service.userservice.UserRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRegistration userRegistration;

    @Autowired
    private UserLogging userLogging;

    public ResponseEntity<String> registerUser(String token, UserCredentialsDto userCredentialsDto){
        return userRegistration.registerUser(token, userCredentialsDto);
    }

    public ResponseEntity<StringDto> createGuestUserAndGenerateToken(){
        return userLogging.createGuestUserAndGenerateToken();
    }

    public ResponseEntity<String> loginUserAndGenerateNewToken(String token, UserCredentialsDto userCredentialsDto){
        return userLogging.loginUserAndGenerateNewToken(token, userCredentialsDto);
    }

    public ResponseEntity<String> logoutUser(String token){
        return userLogging.logoutUser(token);
    }
}
