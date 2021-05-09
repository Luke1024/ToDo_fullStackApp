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
                if (checkIfUserUsingTokenExist()) {
                    if (isUserWithCredentialsRegistered()) {
                        if (isUserLogggingSuccesfull()) {
                            return new ResponseEntity<>(new StringDto("User succesfully logged in."), HttpStatus.ACCEPTED);
                        } else return new ResponseEntity<>(new StringDto("User already logged."), HttpStatus.BAD_REQUEST);
                    } else return new ResponseEntity<>(new StringDto("User not exist."), HttpStatus.BAD_REQUEST);
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

    private boolean checkIfUserUsingTokenExist(){
        return userRepository.findUserByToken(this.token).isPresent();
    }

    private boolean isUserWithCredentialsRegistered(){
        Optional<User> userToRegister = userRepository.findUserByToken(this.token);
        if(userToRegister.get().registerUser(this.userCredentialsDto)){
            return true;
        } else return false;
    }

    private boolean isUserLogggingSuccesfull(){
        User userAsQuest = userRepository.findUserByToken(this.token).get();
        userAsQuest.logOutUser();

        User userToLogin = userRepository.findByEmail(this.userCredentialsDto.getUserEmail()).get();
        if(userToLogin.logInUser(this.userCredentialsDto.getUserPassword(), this.token)) return true;
        else return false;
    }

}
