package com.server.app.service;

import com.server.app.mapper.TaskMapper;
import com.server.app.repository.TaskRepository;
import com.server.app.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TaskServiceIntegrationTest {

    private Random random = new Random();

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Test
    public void getTasksFromLoggedUser(){

    }

    @Test
    public void getTasksFromUserWithExpiredSession(){

    }

    @Test
    public void getTasksWithUnusedToken(){

    }


    @Test
    public void saveTask(){

    }

    @Test
    public void saveTaskWithUnusedToken(){

    }

    @Test
    public void saveTaskWhenUserSessionExpired(){

    }


    @Test
    public void updateTask(){

    }

    @Test
    public void updatTaskWithUnusedToken(){

    }

    @Test
    public void updateTaskWhenUserSessionExpired(){

    }

    @Test
    public void updateTaskWithMistakenId(){

    }

    @Test
    public void deleteTask(){

    }

    @Test
    public void deleteTaskWithUnusedToken(){

    }

    @Test
    public void deleteTaskWhenUserSessionExpired(){

    }

    @Test
    public void deleteTaskWithMistakenId(){

    }

    private String generateToken(){
        int leftLimit = 32;
        int rightLimit = 127;
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