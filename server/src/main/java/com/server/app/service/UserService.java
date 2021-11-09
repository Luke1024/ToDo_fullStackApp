package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.domain.dto.StringDto;
import com.server.app.domain.dto.UserCredentialsDto;
import com.server.app.repository.UserRepository;
import com.server.app.service.userservice.UserLogging;
import com.server.app.service.userservice.UserLoggingOut;
import com.server.app.service.userservice.UserRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserServiceSettings serviceSettings;

    @Autowired
    private UserRegistration userRegistration;

    @Autowired
    private UserLogging userLogging;

    @Autowired
    private UserLoggingOut loggingOut;

    @Autowired
    private UserRepository userRepository;

    private Random random = new Random();

    public ResponseEntity<StringDto> registerUser(String token, UserCredentialsDto userCredentialsDto){
        return userRegistration.registerUser(token, userCredentialsDto);
    }

    public ResponseEntity<StringDto> createGuestUserAndGenerateToken(){
        String guestToken = generateToken();
        User newUser = new User();
        newUser.setTypeOfUser(TypeOfUser.GUEST);
        Session guestSession = generateSession(guestToken, newUser);
        newUser.addSession(guestSession);
        userRepository.save(newUser);
        return ResponseEntity.ok(new StringDto(guestToken));
    }

    private Session generateSession(String token, User newUser){
        LocalDateTime sessionActiveTo = LocalDateTime.now().plusHours(serviceSettings.getSessionActiveHours());
        return new Session(newUser, token, sessionActiveTo);
    }

    public ResponseEntity<StringDto> loginUser(String token, UserCredentialsDto userCredentialsDto){
        return userLogging.loginUser(token, userCredentialsDto);
    }

    public ResponseEntity<StringDto> logoutUser(String token){
        return loggingOut.logoutUser(token);
    }

    private String generateToken(){
        int leftLimit = 97;
        int rightLimit = 122;
        int targetStringLength = 15;
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }
}
