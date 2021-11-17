package com.server.app.repository;

import com.server.app.domain.AppUser;
import com.server.app.domain.Task;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void findAvailableTaskByUserIdAndTaskId() {
        AppUser user = new AppUser();
        Task task = new Task(user, "", "", false);

        user.addTasks(Collections.singletonList(task));
        userRepository.save(user);

        Assert.assertEquals(task.getId(), taskRepository.findAvailableTaskByUserIdAndTaskId(user.getId(), task.getId()).get().getId());
    }

    @Test
    public void findAvailableTasksByUserId() {
        AppUser user = new AppUser();
        Task task1 = new Task(user, "", "", false);
        Task task2 = new Task(user, "", "", false);

        user.addTasks(Arrays.asList(task1, task2));
        userRepository.save(user);

        Assert.assertEquals(2, taskRepository.findAvailableTasksByUserId(user.getId()).size());
    }

    @Test
    public void findAvailableTasksByUserIdDone() {
        AppUser user = new AppUser();
        Task task1 = new Task(user, "", "", true);
        Task task2 = new Task(user, "", "", true);
        Task task3 = new Task(user, "", "", false);

        user.addTasks(Arrays.asList(task1, task2, task3));
        userRepository.save(user);

        Assert.assertEquals(2, taskRepository.findAvailableTasksByUserIdDone(user.getId()).size());
    }

    @Test
    public void findAvailableTasksByUserIdTodo() {
        AppUser user = new AppUser();
        Task task1 = new Task(user, "", "", false);
        Task task2 = new Task(user, "", "", false);
        Task task3 = new Task(user, "", "", true);

        user.addTasks(Arrays.asList(task1, task2, task3));
        userRepository.save(user);

        Assert.assertEquals(2, taskRepository.findAvailableTasksByUserIdTodo(user.getId()).size());
    }
}