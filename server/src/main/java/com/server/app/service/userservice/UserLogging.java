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

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserLogging {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRepository userRepository;

    private Logger LOGGER = LoggerFactory.getLogger(UserLogging.class);

    private String token;
    private UserCredentialsDto userCredentialsDto;

    public ResponseEntity<StringDto> loginUser(String token, UserCredentialsDto userCredentialsDto) {
        loadDataToAnalysis(token, userCredentialsDto);
        if (analyzeToken()) {
            if (analyzeCredentials()) {
                if (findUserUsingToken()) {
                    if (checkIfUserWithCredentialsExist()) {
                        if (executeUserLogging()) {
                            return new ResponseEntity<>(new StringDto("User succesfully logged in."), HttpStatus.ACCEPTED);
                        } else return new ResponseEntity<>(new StringDto("User already logged."), HttpStatus.BAD_REQUEST);
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
        if(userCredentialsDto != null){
            if(userCredentialsDto.getUserPassword() != null && userCredentialsDto.getUserEmail() != null) {
                if (userCredentialsDto.getUserPassword().length() >= serviceSettings.getMinimalPasswordLength()) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean findUserUsingToken() {
        return userRepository.findUserByToken(this.token).isPresent();
    }

    private boolean checkIfUserWithCredentialsExist(){
        return userRepository.findUserByEmailAndPassword(
                this.userCredentialsDto.getUserEmail(),
                this.userCredentialsDto.getUserPassword()).isPresent();
    }

    private boolean executeUserLogging(){
        logOutGuestUserWithCurrentToken();
        Optional<User> userAsLoggedOut = userRepository.findUserByEmailAndPassword(this.userCredentialsDto.getUserEmail(),
                this.userCredentialsDto.getUserPassword());
        if(userAsLoggedOut.isPresent()){
            if(checkIfUserLoggedIn(userAsLoggedOut.get())) {
                logInUser(userAsLoggedOut.get());
                return true;
            }
        }
        return false;
    }

    private void logOutGuestUserWithCurrentToken(){
        userRepository.findUserByToken(this.token).get().setToken("");
    }

    private boolean checkIfUserLoggedIn(User userAsLoggedOut) {
        if (userAsLoggedOut.getToken().length() == 0) {
            return false;
        } else return true;
    }

    private void logInUser(User userAsLoggedOut) {
        userAsLoggedOut.setToken(this.token);
        userAsLoggedOut.setSessionActiveTo(LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours()));
        userRepository.save(userAsLoggedOut);
    }
}
