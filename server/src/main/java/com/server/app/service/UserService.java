package com.server.app.service;

import com.server.app.domain.UserDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.userservice.UserLogging;
import com.server.app.service.userservice.UserRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class UserService {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    private Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRegistration userRegistration;

    @Autowired
    private UserLogging userLogging;

    public ServiceResponse registerUser(UserDto userDto){
        return userRegistration.registerUser(userDto);
    }

    public String createGuestUserAndGenerateToken(){
        return userLogging.createGuestUserAndGenerateToken();
    }

    public ServiceResponse loginUserAndGenerateNewToken(UserDto userDto){
        return userLogging.loginUserAndGenerateNewToken(userDto);
    }

    public ServiceResponse logoutUser(String token){
        return userLogging.logoutUser(token);
    }
}
