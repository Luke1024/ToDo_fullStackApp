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
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSave(){
        Task task = new Task(1,null, "task1", "task1 description", false);

        taskRepository.save(task);
        Assert.assertNotNull(task.getId());
        taskRepository.deleteById(task.getId());
        Assert.assertNull(task.getId());
    }

    @Test
    public void testUpdate(){
        Task task = new Task(1,null, "task1", "task1 description", false);

        taskRepository.save((task));
        Optional<Task> taskOptional = taskRepository.findById(task.getId());
        taskOptional.get().setTaskDescription("new description");
        taskRepository.save(taskOptional.get());
        Assert.assertEquals("new description",taskRepository.findById(task.getId()).get().getTaskDescription());
        taskRepository.delete(task);
    }

    @Test
    public void checkIfUserStillExistAfterTaskDelete(){
        User user1 = new User("","",true,"", LocalDateTime.now().plusHours(1),new ArrayList<>());
        Task task = new Task(1,user1, "task1", "task1 description", false);
        user1.getTaskList().add(task);
        userRepository.save(user1);
        taskRepository.save(task);
        Assert.assertNotNull(task.getId());
        taskRepository.deleteById(task.getId());

        Assert.assertEquals(null, task.getId());
        Assert.assertEquals(user1.getId(),userRepository.findById(user1.getId()).get().getId());
    }
}