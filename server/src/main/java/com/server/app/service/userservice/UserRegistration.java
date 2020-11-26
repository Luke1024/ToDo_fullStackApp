package com.server.app.service.userservice;

import com.server.app.domain.User;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.UserServiceSettings;
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
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserDtoChecker dtoChecker;

    public ResponseEntity registerUser(String token, UserCredentialsDto userCredentialsDto){
        if(token.length()>= serviceSettings.getAcceptTokenLength() && token != null){
            Optional<User> user = userRepository.findLoggedUserByToken(token);
            if(user.isPresent()) {
                return processToUserRegistration(user.get(), userCredentialsDto);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    private ResponseEntity processToUserRegistration(User userAsGuest,UserCredentialsDto userCredentialsDto){
        if(userWithThisEmailExist(userCredentialsDto.getUserEmail())){
            return ResponseEntity.badRequest().build();
        } else {
            userRepository.save(createNewUser(userCredentialsDto));
            return ResponseEntity.accepted().build();
        }
    }

    private boolean userWithThisEmailExist(String userEmail){
        return userRepository.findByEmail(userEmail).isPresent();
    }

    private User createNewUser(UserCredentialsDto userCredentialsDto){
        return new User(userCredentialsDto.getUserEmail(), userCredentialsDto.getUserPassword(),
                false, "", null, new ArrayList<>());
    }
}
