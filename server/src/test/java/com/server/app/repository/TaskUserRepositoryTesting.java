package com.server.app.repository;

import com.server.app.domain.Task;
import com.server.app.domain.User;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskUserRepositoryTesting {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    public void testSave(){
        User user1 = new User("User1", "user1@gmail.com", "chn2347asd",
                true, "asda3534532", LocalDateTime.now().plusHours(3), new ArrayList<>());

        List<Task> tasks = new ArrayList<>(Arrays.asList(
                new Task(1, null, "task1", "task1 description", false),
                new Task(2, null, "task2", "task2 description", true),
                new Task(3, null, "task3", "task3 description", true)
        ));

        user1.addTasks(tasks);

        userRepository.save(user1);

        List<Task> taskList = user1.getTaskList();
        for(int i=0; i<taskList.size(); i++){
            Assert.assertNotNull(taskList.get(i).getId());
            Assert.assertEquals(user1.getId(),taskList.get(i).getUser().getId());
        }

        userRepository.deleteById(user1.getId());
    }

    @Test
    public void testUpdate(){
        User user1 = new User("User1", "user1@gmail.com", "chn2347asd",
                true, "asda3534532", LocalDateTime.now().plusHours(3), new ArrayList<>());

        List<Task> tasks = new ArrayList<>(Arrays.asList(
                new Task(1, null, "task1", "task1 description", false),
                new Task(2, null, "task2", "task2 description", true),
                new Task(3, null, "task3", "task3 description", true)
        ));

        user1.addTasks(tasks);
        userRepository.save(user1);

        Task task1 = user1.getTaskList().get(0);
        task1.setTaskDescription("new description");
        taskRepository.save(task1);
        Assert.assertEquals("new description", taskRepository.findById(task1.getId()).get().getTaskDescription());
    }
}
