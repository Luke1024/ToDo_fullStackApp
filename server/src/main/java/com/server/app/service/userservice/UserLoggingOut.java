package com.server.app.service.userservice;

import com.server.app.domain.StringDto;
import com.server.app.domain.User;
import com.server.app.repository.UserRepository;
import com.server.app.service.UserServiceSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public class UserLoggingOut {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    private Logger LOGGER = LoggerFactory.getLogger(UserLoggingOut.class);

    public ResponseEntity<StringDto> logoutUser(String token){
        Optional<User> userOptional = findUserByToken(token);
        if(userOptional.isPresent()){
            LOGGER.info(("Logging out user with token " + token));
            userOptional.get().logOutUser();
            userRepository.save(userOptional.get());
            return new ResponseEntity<>(new StringDto("User succesfully logged out."), HttpStatus.ACCEPTED);
        } else {
            LOGGER.warn("Logout failed. User with token " + token + " don't exist or logged out.");
            return new ResponseEntity<>(new StringDto("User session expired or logged out."), HttpStatus.BAD_REQUEST);
        }
    }

    private Optional<User> findUserByToken(String token){
        return userRepository.findUserByToken(token);
    }
}
