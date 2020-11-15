package com.server.app.repository;

import com.server.app.domain.Task;
import com.server.app.domain.User;
import junit.framework.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSave(){

        User user1 = new User("User1", "user1@gmail.com", "chn2347asd",
                true, "asda3534532", LocalDateTime.now().plusHours(3), new ArrayList<>());


        Assert.assertNull(user1.getId());
        userRepository.save(user1);
        Assert.assertNotNull(user1.getId());
        userRepository.deleteById(user1.getId());
        Assert.assertEquals(Optional.empty(),userRepository.findById(user1.getId()));
    }

    @Test
    public void testUpdate(){
        User user1 = new User("User1", "user1@gmail.com", "chn2347asd",
                true, "asda3534532", LocalDateTime.now().plusHours(3), new ArrayList<>());

        userRepository.save(user1);

        Optional<User> userOptional = userRepository.findById(user1.getId());
        userOptional.get().setToken("aca734qga");
        userRepository.save(userOptional.get());

        Assert.assertEquals("aca734qga",userRepository.findById(user1.getId()).get().getToken());
        userRepository.deleteById(user1.getId());
    }
}