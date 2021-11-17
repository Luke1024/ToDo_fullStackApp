package com.server.app.repository;

import com.server.app.domain.AppSession;
import com.server.app.domain.AppUser;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SessionRepositoryTest {

    @Autowired
    private SessionRepository sessionRepository;

    private Random random = new Random();

    @Test
    public void testFindSessionByToken(){
        String token = generateToken();

        AppSession appSession = new AppSession(new AppUser(), token, LocalDateTime.now(), LocalDateTime.now());
        sessionRepository.save(appSession);

        Optional<AppSession> appSessionOptional = sessionRepository.findSessionByToken(token);

        Assert.assertEquals(token, appSessionOptional.get().getToken());
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