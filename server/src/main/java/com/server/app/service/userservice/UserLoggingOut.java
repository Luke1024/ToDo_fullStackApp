package com.server.app.service.userservice;

import com.server.app.domain.AppSession;
import com.server.app.domain.dto.StringDto;
import com.server.app.repository.SessionRepository;
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
public class UserLoggingOut {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    private Logger LOGGER = LoggerFactory.getLogger(UserLoggingOut.class);

    public ResponseEntity<StringDto> logoutUser(String token){
        Optional<AppSession> optionalSessionToEnd = sessionRepository.findSessionByToken(token);

        if(optionalSessionToEnd.isPresent()){
            if(endingSession(token, optionalSessionToEnd.get())){
                LOGGER.info(("Logging out user with token " + token));
                return new ResponseEntity<>(new StringDto("User succesfully logged out."), HttpStatus.ACCEPTED);
            } else {
                return new ResponseEntity<>(new StringDto("User already logged out."), HttpStatus.ACCEPTED);
            }
        } else {
            LOGGER.warn("Logout failed. User with token " + token + " don't exist or logged out.");
            return new ResponseEntity<>(new StringDto("User session expired or logged out."), HttpStatus.BAD_REQUEST);
        }
    }

    private boolean endingSession(String token, AppSession appSession){
        appSession.setToken("");
        sessionRepository.save(appSession);
        return true;
    }
}
