package com.server.app.service.userservice;

import com.server.app.domain.UserCredentialsDto;
import com.server.app.service.UserServiceSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserDtoChecker {

    @Autowired
    private UserServiceSettings serviceSettings;

    public String checkDto(UserCredentialsDto userCredentialsDto) {
        if (userCredentialsDto != null) {
            String message = checkToken(userCredentialsDto.getUserToken());
            message += checkMail(userCredentialsDto.getUserEmail());
            message += checkPassword(userCredentialsDto.getUserPassword());
            return message;
        } else {
            return "UserDto is null.";
        }
    }

    private String checkToken(String token){
        if(token != null){
            if(token.length() == serviceSettings.getAcceptTokenLength()){
                return "";
            } else {
                return "Token length not accepted, proper token length is " + serviceSettings.getAcceptTokenLength();
            }
        } else return "Token string is null.";
    }

    private String checkMail(String mail){
        if(mail != null){
            return "";
        } else return "Mail string is null.";
    }

    private String checkPassword(String password){
        if(password != null){
            if(password.length() >= serviceSettings.getMinimalPasswordLength()){
                return "";
            } else return "Password is too short. Minimal password length is " + serviceSettings.getMinimalPasswordLength();
        } else return "Password string is null.";
    }
}
