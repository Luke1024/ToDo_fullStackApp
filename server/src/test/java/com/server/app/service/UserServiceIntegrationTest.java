package com.server.app.service;

import com.server.app.domain.User;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.repository.UserRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceIntegrationTest {

    private Random random = new Random();

    @Autowired
    private UserServiceSettings settings;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void registerUser(){
        String guestToken = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User userAsGuest = new User("", "", true, guestToken, LocalDateTime.now(), new ArrayList<>());
        userRepository.save(userAsGuest);

        UserCredentialsDto credentialsDto = new UserCredentialsDto(userEmail, userPassword);

        Assert.assertEquals(ResponseEntity.accepted().build(), userService.registerUser(guestToken, credentialsDto));

        Optional<User> optionalUser = userRepository.findUserByEmailAndPassword(userEmail, userPassword);

        Assert.assertEquals(userEmail, optionalUser.get().getUserEmail());
        Assert.assertEquals(userPassword, optionalUser.get().getPassword());

        userRepository.delete(optionalUser.get());
    }

    @Test
    public void registerUserWithoutActiveGuestToken(){
        String guestToken = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        UserCredentialsDto credentialsDto = new UserCredentialsDto(userEmail, userPassword);

        Assert.assertEquals(ResponseEntity.badRequest().build(), userService.registerUser(guestToken, credentialsDto));

        Assert.assertEquals(Optional.empty(), userRepository.findUserByEmailAndPassword(userEmail, userPassword));
    }

    @Test
    public void registerUserWithShorterPasswordThatAccepted(){
        String guestToken = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength()-1);

        User userAsGuest = new User("", "", true, guestToken, LocalDateTime.now(), new ArrayList<>());
        userRepository.save(userAsGuest);

        UserCredentialsDto credentialsDto = new UserCredentialsDto(userEmail, userPassword);

        Assert.assertEquals(ResponseEntity.badRequest().build(), userService.registerUser(guestToken, credentialsDto));

        Assert.assertEquals(Optional.empty(), userRepository.findUserByEmailAndPassword(userEmail, userPassword));
        userRepository.delete(userAsGuest);
    }

    @Test
    public void registerUserWhenUserEmailAreadyExist(){
        String guestToken = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, "", true, guestToken, LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        Assert.assertEquals(ResponseEntity.badRequest().build(),
                userService.registerUser(guestToken, new UserCredentialsDto(userEmail, userPassword)));

        Assert.assertEquals(Optional.empty(), userRepository.findUserByEmailAndPassword(userEmail, userPassword));

        userRepository.delete(user1);
    }

    @Test
    public void createGuestUserAndGenerateToken(){
        ResponseEntity<String> responseEntity = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK,responseEntity.getStatusCode());

        User guestUser = userRepository.findLoggedUserByToken(responseEntity.getBody()).get();
        Assert.assertEquals(guestUser.getToken(), responseEntity.getBody());

        userRepository.delete(guestUser);;
    }

    @Test
    public void loginUserAndGenerateNewToken(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, false, "", LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<String> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<String> loginResponse = userService.loginUserAndGenerateNewToken(guestUserResponse.getBody(),
                new UserCredentialsDto(userEmail, userPassword));
        Optional<User> user = userRepository.findById(user1.getId());

        Assert.assertEquals(true, user.get().isLogged());
        Assert.assertEquals(loginResponse.getBody(), user.get().getToken());

        userRepository.delete(user1);
    }

    @Test
    public void loginUserWithNotExistingCredentials(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        ResponseEntity<String> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<String> loginResponse = userService.loginUserAndGenerateNewToken(guestUserResponse.getBody(),
                new UserCredentialsDto(userEmail, userPassword));

        Assert.assertEquals(ResponseEntity.badRequest().build(), loginResponse);
    }

    @Test
    public void loginUserWithBadToken(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, false, "", LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<String> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<String> loginResponse = userService.loginUserAndGenerateNewToken(generateToken(settings.getAcceptTokenLength()),
                new UserCredentialsDto(userEmail, userPassword));

        Assert.assertEquals(ResponseEntity.badRequest().build(), loginResponse);

        userRepository.delete(user1);
    }

    @Test
    public void loginUserWithBadPassword(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());
        String badPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, false, "", LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<String> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<String> loginResponse = userService.loginUserAndGenerateNewToken(guestUserResponse.getBody(), new UserCredentialsDto(userEmail, badPassword));

        Assert.assertEquals(ResponseEntity.badRequest().build(), loginResponse);
        userRepository.delete(user1);
    }

    @Test
    public void logoutUser(){
        String token = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, true, token, LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<String> logoutResponse = userService.logoutUser(token);
        Assert.assertEquals(ResponseEntity.accepted().build(), logoutResponse);

        userRepository.delete(user1);
    }

    @Test
    public void logoutWithBadToken(){
        String token = generateToken(settings.getAcceptTokenLength());
        String badToken = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, true, token, LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<String> logoutResponse = userService.logoutUser(badToken);
        Assert.assertEquals(ResponseEntity.badRequest().build(), logoutResponse);

        userRepository.delete(user1);
    }

    private String generateToken(int tokenLength){
        int leftLimit = 32;
        int rightLimit = 127;
        int targetStringLength = tokenLength;
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }
}