package com.server.app.repository;

import com.server.app.domain.AppUser;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Random;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private Random random = new Random();

    @Test
    public void findByEmail() {
        AppUser appUser = new AppUser();
        String email = generateToken();
        appUser.setUserEmail(email);

        userRepository.save(appUser);

        Assert.assertEquals(appUser.getId(),userRepository.findByEmail(email).get().getId());
        Assert.assertFalse(userRepository.findByEmail("email").isPresent());
    }

    @Test
    public void findUserByEmailAndPassword() {
        AppUser appUser = new AppUser();
        String email = generateToken();
        String password = generateToken();
        appUser.setUserEmail(email);
        appUser.setPassword(password);

        userRepository.save(appUser);

        Assert.assertEquals(appUser.getId(),userRepository.findUserByEmailAndPassword(email, password).get().getId());
        Assert.assertFalse(userRepository.findUserByEmailAndPassword(email,"password").isPresent());
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