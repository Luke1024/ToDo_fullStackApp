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
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    public void testSave(){
        Task task = new Task(1, null, "task1", "task1 description", false);

        taskRepository.save(task);
        Assert.assertNotNull(task.getId());
        taskRepository.deleteById(task.getId());
    }

    @Test
    public void testUpdate(){
        Task task = new Task(1, null, "task1", "task1 description", false);

        taskRepository.save((task));
        Optional<Task> taskOptional = taskRepository.findById(task.getId());
        taskOptional.get().setTaskDescription("new description");
        taskRepository.save(taskOptional.get());
        Assert.assertEquals("new description",taskRepository.findById(task.getId()).get().getTaskDescription());
    }

    @Test
    public void findTasksByActiveToken_TokenActive(){
        String token = "nqbwkjehgqlkwe";

        User user1 = new User("user@mail.com", "password1", true, token, LocalDateTime.now().plusHours(1), new ArrayList<>());
        Task task1 = new Task(1, user1, "task1", "task1 description", false);
        Task task2 = new Task(2, user1, "task2", "task2 description", true);

        taskRepository.save(task1);
        taskRepository.save(task2);

        List<Task> taskList = taskRepository.findTasksByActiveToken(token);

        Assert.assertEquals(new ArrayList<>(Arrays.asList(task1, task2)).toString(), taskList.toString());

        taskRepository.deleteById(task1.getId());
        taskRepository.deleteById(task2.getId());
    }
}