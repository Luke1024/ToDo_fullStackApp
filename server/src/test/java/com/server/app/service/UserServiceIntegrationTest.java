package com.server.app.service;

import com.server.app.domain.StringDto;
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

        Assert.assertEquals(new ResponseEntity<>(new StringDto("Registration failed, token " + guestToken + " expired."),
                        HttpStatus.BAD_REQUEST).toString(),
                userService.registerUser(guestToken, credentialsDto).toString());

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

        Assert.assertEquals(new ResponseEntity<>(new StringDto("Password is to short."), HttpStatus.BAD_REQUEST).toString(),
                userService.registerUser(guestToken, credentialsDto).toString());

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

        Assert.assertEquals(new ResponseEntity<>(new StringDto("User with this email already exist."),
                        HttpStatus.BAD_REQUEST).toString(), userService.registerUser(
                                guestToken, new UserCredentialsDto(userEmail, userPassword)).toString());

        Assert.assertEquals(Optional.empty(), userRepository.findUserByEmailAndPassword(userEmail, userPassword));

        userRepository.delete(user1);
    }

    @Test
    public void createGuestUserAndGenerateToken(){
        ResponseEntity<StringDto> responseEntity = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK,responseEntity.getStatusCode());

        User guestUser = userRepository.findLoggedUserByToken(responseEntity.getBody().getValue()).get();
        Assert.assertEquals(guestUser.getToken(), responseEntity.getBody().getValue());

        userRepository.delete(guestUser);;
    }

    @Test
    public void loginUserAndGenerateNewToken(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, false, "", LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<StringDto> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<StringDto> loginResponse = userService.loginUser(guestUserResponse.getBody().getValue(),
                new UserCredentialsDto(userEmail, userPassword));
        Optional<User> user = userRepository.findById(user1.getId());

        Assert.assertEquals(true, user.get().isLogged());
        Assert.assertEquals(loginResponse.getBody().getValue(), user.get().getToken());

        userRepository.delete(user1);
    }

    @Test
    public void loginUserWithNotExistingCredentials(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        ResponseEntity<StringDto> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<StringDto> loginResponse = userService.loginUser(guestUserResponse.getBody().getValue(),
                new UserCredentialsDto(userEmail, userPassword));

        Assert.assertEquals(new ResponseEntity<>(new StringDto("User email or password are incorrect or user doeesn't exist.")
                ,HttpStatus.BAD_REQUEST).toString(),loginResponse.toString());
    }

    @Test
    public void loginUserWithBadToken(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, false, "", LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<StringDto> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<StringDto> loginResponse = userService.loginUser(generateToken(settings.getAcceptTokenLength()),
                new UserCredentialsDto(userEmail, userPassword));

        ResponseEntity<StringDto> expectedResponse =
                new ResponseEntity<>(new StringDto("User session expired or logged out."),
                        HttpStatus.BAD_REQUEST);

        Assert.assertEquals(expectedResponse.getStatusCode(), loginResponse.getStatusCode());
        Assert.assertEquals(expectedResponse.getBody().getValue(), loginResponse.getBody().getValue());

        userRepository.delete(user1);
    }

    @Test
    public void loginUserWithBadPassword(){
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());
        String badPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, false, "", LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<StringDto> guestUserResponse = userService.createGuestUserAndGenerateToken();
        Assert.assertEquals(HttpStatus.OK, guestUserResponse.getStatusCode());

        ResponseEntity<StringDto> loginResponse = userService.loginUser(guestUserResponse.getBody().getValue(), new UserCredentialsDto(userEmail, badPassword));

        Assert.assertEquals(new ResponseEntity<>(new StringDto("User email or password are incorrect or user doeesn't exist."),
                HttpStatus.BAD_REQUEST).toString(), loginResponse.toString());
        userRepository.delete(user1);
    }

    @Test
    public void logoutUser(){
        String token = generateToken(settings.getAcceptTokenLength());
        String userEmail = generateToken(10);
        String userPassword = generateToken(settings.getMinimalPasswordLength());

        User user1 = new User(userEmail, userPassword, true, token, LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        ResponseEntity<StringDto> logoutResponse = userService.logoutUser(token);
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

        ResponseEntity<StringDto> logoutResponse = userService.logoutUser(badToken);
        Assert.assertEquals(new ResponseEntity<>(new StringDto("User session expired or logged out."),
                HttpStatus.BAD_REQUEST).toString(), logoutResponse.toString());

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