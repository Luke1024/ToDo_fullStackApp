package com.server.app.service.userservice;

import com.server.app.domain.User;
import com.server.app.domain.UserDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.ServiceResponse;
import com.server.app.service.UserServiceSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserRegistration {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserDtoChecker dtoChecker;

    public ServiceResponse registerUser(UserDto userDto){
        String message = dtoChecker.checkDto(userDto);
        if(message.equals("")){
            return processToUserRegistration(userDto);
        } else {
            return new ServiceResponse(HttpStatus.BAD_REQUEST, message);
        }
    }

    private ServiceResponse processToUserRegistration(UserDto userDto){
        if(userWithThisEmailExist(userDto.getUserEmail())){
            return new ServiceResponse(HttpStatus.BAD_REQUEST,"User with this email already exist.");
        } else {
            userRepository.save(createNewUser(userDto));
            return new ServiceResponse(HttpStatus.OK,"");
        }
    }

    private boolean userWithThisEmailExist(String userEmail){
        return userRepository.findByEmail(userEmail).isPresent();
    }

    private User createNewUser(UserDto userDto){
        return new User(userDto.getUserEmail(), userDto.getUserPassword(), false, "", null, new ArrayList<>());
    }
}
