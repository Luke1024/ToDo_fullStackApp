package com.server.app.repository;

import com.server.app.domain.Task;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    public void testSave(){
        Task task = new Task(null, "task1", "task1 description", false);

        taskRepository.save(task);
        Assert.assertNotNull(task.getId());
        taskRepository.deleteById(task.getId());
    }

    @Test
    public void testUpdate(){
        Task task = new Task(null, "task1", "task1 description", false);

        taskRepository.save((task));
        Optional<Task> taskOptional = taskRepository.findById(task.getId());
        taskOptional.get().setTaskDescription("new description");
        taskRepository.save(taskOptional.get());
        Assert.assertEquals("new description",taskRepository.findById(task.getId()).get().getTaskDescription());
    }
}