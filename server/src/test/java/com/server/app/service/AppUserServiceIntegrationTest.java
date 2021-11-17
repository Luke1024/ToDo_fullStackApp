package com.server.app.service;

import com.server.app.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Random;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AppUserServiceIntegrationTest {

    private Random random = new Random();

    @Autowired
    private UserServiceSettings settings;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void registerUser(){

    }

    @Test
    public void registerUserWithoutActiveGuestToken(){

    }

    @Test
    public void registerUserWithShorterPasswordThatAccepted(){

    }

    @Test
    public void registerUserWhenUserEmailAreadyExist(){

    }

    @Test
    public void createGuestUserAndGenerateToken(){

    }

    @Test
    public void loginUserAndGenerateNewToken(){

    }

    @Test
    public void loginUserWithNotExistingCredentials(){

    }

    @Test
    public void loginUserWithBadToken(){

    }

    @Test
    public void loginUserWithBadPassword(){

    }

    @Test
    public void logoutUser(){

    }

    @Test
    public void logoutWithBadToken(){

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