package com.server.app.service.userservice;

import com.server.app.domain.Session;
import com.server.app.domain.dto.StringDto;
import com.server.app.domain.User;
import com.server.app.domain.dto.UserCredentialsDto;
import com.server.app.repository.SessionRepository;
import com.server.app.repository.UserRepository;
import com.server.app.service.UserServiceSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserLogging {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    private String token;
    private UserCredentialsDto userCredentialsDto;
    private Session sessionToEnd;
    private User userToLogIn;

    public ResponseEntity<StringDto> loginUser(String token, UserCredentialsDto userCredentialsDto) {
        loadDataToAnalysis(token, userCredentialsDto);
        if (analyzeToken()) {
            if (analyzeCredentials()) {
                if(findSessionUsingToken()){
                    if(loadUserWithCredentials()){
                        executeUserLogging();
                        return new ResponseEntity<>(new StringDto("User succesfully logged in."), HttpStatus.ACCEPTED);
                    } else return new ResponseEntity<>(new StringDto("Credentials aren't valid."), HttpStatus.BAD_REQUEST);
                } else return new ResponseEntity<>(new StringDto("Session expired."), HttpStatus.BAD_REQUEST);
            } else return new ResponseEntity<>(new StringDto("Password is too short or there is something with credentials in general."), HttpStatus.BAD_REQUEST);
        } else return new ResponseEntity<>(new StringDto("Token is not valid."), HttpStatus.BAD_REQUEST);
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
        if(userCredentialsDto != null && userCredentialsDto.getUserPassword() != null && userCredentialsDto.getUserEmail() != null) {
                if (userCredentialsDto.getUserPassword().length() >= serviceSettings.getMinimalPasswordLength()) {
                    return true;
                }
        }
        return false;
    }

    private boolean findSessionUsingToken() {
        Optional<Session> sessionOptional = sessionRepository.findSessionByToken(this.token);
        if(sessionOptional.isPresent()){
            sessionToEnd = sessionOptional.get();
            return true;
        } else return false;
    }

    private boolean loadUserWithCredentials(){
        Optional<User> userOptional = userRepository.findUserByEmailAndPassword(
                this.userCredentialsDto.getUserEmail(),
                this.userCredentialsDto.getUserPassword());
        if(userOptional.isPresent()){
            userToLogIn = userOptional.get();
            return true;
        } else return false;
    }

    private void executeUserLogging(){
        sessionToEnd.setToken("");
        sessionRepository.save(sessionToEnd);

        LocalDateTime sessionActiveTo = LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours());
        Session newSession = new Session(userToLogIn, token, sessionActiveTo);
        sessionRepository.save(newSession);
    }
}
