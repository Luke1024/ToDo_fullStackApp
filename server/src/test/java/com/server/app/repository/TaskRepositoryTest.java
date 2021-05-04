package com.server.app.repository;

import com.server.app.domain.Task;
import com.server.app.domain.User;
import org.junit.Assert;
import org.junit.Ignore;
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
import java.util.stream.Collectors;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Ignore
    public void testSave(){
        Task task = new Task(null, "task1", "task1 description", false);

        taskRepository.save(task);
        Assert.assertNotNull(task.getId());
    }

    @Test
    public void testUpdate(){
        User user1 = new User("","",true,"", LocalDateTime.now().plusHours(1),new ArrayList<>());
        Task task = new Task(user1, "task1", "task1 description", false);
        taskRepository.save((task));
        Optional<Task> taskOptional = taskRepository.findAvailableTaskByUserIdAndTaskId(user1.getId(),task.getId());
        taskOptional.get().setTaskDescription("new description");
        taskRepository.save(taskOptional.get());
        Assert.assertEquals("new description",taskRepository.findAvailableTaskByUserIdAndTaskId(
                user1.getId(), task.getId())
                .get().getTaskDescription());
        taskRepository.delete(task);
    }

    @Test
    public void testNotFindingTaskAfterMarkingDelete(){
        User user1 = new User("","",true,"", LocalDateTime.now().plusHours(1),new ArrayList<>());
        Task task = new Task(user1, "task1", "task1 description", false);

        taskRepository.save(task);

        Optional<Task> taskOptional = taskRepository.findAvailableTaskByUserIdAndTaskId(user1.getId(), task.getId());
        taskOptional.get().setDeleted(true);
        taskRepository.save(taskOptional.get());

        Optional<Task> taskOptionalDeleted = taskRepository.findAvailableTaskByUserIdAndTaskId(user1.getId(), task.getId());
        Assert.assertEquals(Optional.empty(), taskOptionalDeleted);
    }

    @Test
    public void testFindAvailableTasksByUser(){
        User user1 = new User("","",true,"", LocalDateTime.now().plusHours(1),new ArrayList<>());
        Task task1 = new Task(user1, "task1", "task1 description", false);
        Task task2 = new Task(user1, "task1", "task1 description", false);
        Task task3 = new Task(user1, "task1", "task1 description", false);

        List<Task> taskListExpected = Arrays.asList(task1, task2);
        task3.setDeleted(true);

        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);

        List<Task> taskList = taskRepository.findAvailableTasksByUserId(user1.getId());

        Assert.assertEquals(taskListExpected.stream().map(task -> task.toString()).collect(Collectors.joining()),
                taskList.stream().map(task -> task.toString()).collect(Collectors.joining()));
    }
}