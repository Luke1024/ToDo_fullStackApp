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

    }

    @Test
    public void testNotFindingTaskAfterMarkingDelete(){

    }

    @Test
    public void testFindAvailableTasksByUser(){

    }
}