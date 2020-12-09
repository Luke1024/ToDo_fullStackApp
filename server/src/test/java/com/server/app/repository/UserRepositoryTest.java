package com.server.app.repository;

import com.server.app.domain.User;
import junit.framework.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSave(){

        User user1 = generateUserWithRandomParameters();

        Assert.assertNull(user1.getId());
        userRepository.save(user1);
        Assert.assertNotNull(user1.getId());
        userRepository.deleteById(user1.getId());
        Assert.assertEquals(Optional.empty(),userRepository.findById(user1.getId()));
    }

    @Test
    public void testUpdate(){
        User user1 = generateUserWithRandomParameters();

        String newToken = generateRandomString();

        userRepository.save(user1);

        Optional<User> userOptional = userRepository.findById(user1.getId());
        userOptional.get().setToken(newToken);
        userRepository.save(userOptional.get());

        Assert.assertEquals(newToken,userRepository.findById(user1.getId()).get().getToken());
        userRepository.deleteById(user1.getId());
    }

    @Test
    public void testFindUserWithEmailAndPassword(){
        User user1 = generateUserWithRandomParameters();
        User user2 = generateUserWithRandomParameters();
        userRepository.save(user1);
        userRepository.save(user2);

        Optional<User> userOptional = userRepository.findUserByEmailAndPassword(user2.getUserEmail(), user2.getPassword());

        Assert.assertEquals(user2.toString(), userOptional.get().toString());

        userRepository.deleteById(user1.getId());
        userRepository.deleteById(user2.getId());
    }

    @Test
    public void testFindLoggedUserByToken(){
        User user1 = generateUserWithRandomParameters();
        User user2 = generateUserWithRandomParameters();
        user2.setLogged(false);
        userRepository.save(user1);
        userRepository.save(user2);

        Optional<User> optionalUserLogged = userRepository.findLoggedUserByToken(user1.getToken());
        Optional<User> optionalUserLoggedOut = userRepository.findLoggedUserByToken(user2.getToken());

        Assert.assertEquals(user1.toString(), optionalUserLogged.get().toString());
        Assert.assertEquals(Optional.empty(), optionalUserLoggedOut);

        userRepository.deleteById(user1.getId());
        userRepository.deleteById(user2.getId());
    }

    private User generateUserWithRandomParameters(){
        return new User(generateRandomString(), generateRandomString(), true,
                generateRandomString(), LocalDateTime.now().plusHours(3), new ArrayList<>());
    }

    private String generateRandomString(){
        int leftLimit = 32;
        int rightLimit = 127;
        int targetStringLength = 10;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        String generatedString = buffer.toString();
        return generatedString;
    }
}