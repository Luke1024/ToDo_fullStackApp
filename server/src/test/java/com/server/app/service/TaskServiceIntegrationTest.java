package com.server.app.service;

import com.server.app.domain.Task;
import com.server.app.domain.TaskDto;
import com.server.app.domain.User;
import com.server.app.mapper.TaskMapper;
import com.server.app.repository.TaskRepository;
import com.server.app.repository.UserRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.*;

@RunWith(SpringRunner.class)
@SpringBootTest
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
        String token = generateToken();

        TaskDto taskDto1 = new TaskDto(1,"task1", "task1 description", false);
        TaskDto taskDto2 = new TaskDto(2,"task2","task2 description", true);

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        Task task2 = new Task(2,null,"task2","task2 description", true);

        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Arrays.asList(task1, task2));
        userRepository.save(user1);

        ResponseEntity<List<TaskDto>> responseEntity = taskService.getTasks(token);

        List<TaskDto> taskDtoList = responseEntity.getBody();

        Assert.assertEquals(Arrays.asList(taskDto1, taskDto2).toString(), taskDtoList.toString());

        userRepository.deleteById(user1.getId());
    }

    @Test
    public void getTasksFromUserWithExpiredSession(){
        String token = generateToken();

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        Task task2 = new Task(2,null,"task2","task2 description", true);

        User user1 = new User("user1@email.com", "password1", false, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Arrays.asList(task1, task2));
        userRepository.save(user1);

        ResponseEntity<List<TaskDto>> responseEntity = taskService.getTasks(token);

        Assert.assertEquals(ResponseEntity.badRequest().build(), responseEntity);
        Assert.assertNull(responseEntity.getBody());

        userRepository.deleteById(user1.getId());
    }

    @Test
    public void getTasksWithUnusedToken(){
        String token = generateToken();
        String newToken = generateToken();

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        Task task2 = new Task(2,null,"task2","task2 description", true);

        User user1 = new User("user1@email.com", "password1", false, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Arrays.asList(task1, task2));
        userRepository.save(user1);

        ResponseEntity<List<TaskDto>> responseEntity = taskService.getTasks(newToken);

        Assert.assertEquals(ResponseEntity.badRequest().build(), responseEntity);
        Assert.assertNull(responseEntity.getBody());

        userRepository.deleteById(user1.getId());
    }


    @Test
    public void saveTask(){
        String token = generateToken();

        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        TaskDto taskDto1 = new TaskDto(0,"task1", "task1 description", false);

        Assert.assertEquals(ResponseEntity.accepted().build(), taskService.saveTask(token, taskDto1));

        ResponseEntity<List<TaskDto>> responseRequesting = taskService.getTasks(token);

        Assert.assertEquals(HttpStatus.OK, responseRequesting.getStatusCode());
        Assert.assertEquals(new ArrayList<>(Arrays.asList(taskDto1)).toString(), responseRequesting.getBody().toString());

        userRepository.delete(user1);
    }

    @Test
    public void saveTaskWithUnusedToken(){
        String token = generateToken();
        String unusedToken = generateToken();

        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        TaskDto taskDto1 = new TaskDto(0,"task1", "task1 description", false);

        Assert.assertEquals(ResponseEntity.badRequest().build(), taskService.saveTask(unusedToken, taskDto1));

        userRepository.delete(user1);
    }

    @Test
    public void saveTaskWhenUserSessionExpired(){
        String token = generateToken();

        User user1 = new User("user1@email.com", "password1", false, token,
                LocalDateTime.now(), new ArrayList<>());
        userRepository.save(user1);

        TaskDto taskDto1 = new TaskDto(0,"task1", "task1 description", false);

        Assert.assertEquals(ResponseEntity.badRequest().build(), taskService.saveTask(token, taskDto1));

        userRepository.delete(user1);
    }


    @Test
    public void updateTask(){
        String token = generateToken();

        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());
        Task task1 = new Task(1,null, "task1", "task1 description", false);

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        TaskDto taskUpdatedDto = new TaskDto(task1.getFrontId(),"task1 updated", "task1 description updated", false);

        Assert.assertEquals(ResponseEntity.accepted().build(), taskService.updateTask(token, taskUpdatedDto));

        Task receivedTask = taskRepository.findById(task1.getId()).get();

        Assert.assertEquals("task1 updated", receivedTask.getTaskName());
        Assert.assertEquals("task1 description updated", receivedTask.getTaskDescription());

        userRepository.delete(user1);
    }

    @Test
    public void updatTaskWithUnusedToken(){
        String token = generateToken();
        String unusedToken = generateToken();

        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());
        Task task1 = new Task(1,null, "task1", "task1 description", false);

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        TaskDto taskUpdatedDto = new TaskDto(task1.getFrontId(),"task1 updated", "task1 description updated", false);

        Assert.assertEquals(ResponseEntity.notFound().build(), taskService.updateTask(unusedToken, taskUpdatedDto));

        Optional<Task> receivedTask = taskRepository.findById(task1.getId());

        Assert.assertEquals(task1.toString(), receivedTask.get().toString());

        userRepository.delete(user1);
    }

    @Test
    public void updateTaskWhenUserSessionExpired(){
        String token = generateToken();

        User user1 = new User("user1@email.com", "password1", false, token,
                LocalDateTime.now(), new ArrayList<>());
        Task task1 = new Task(1,null, "task1", "task1 description", false);

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        TaskDto taskUpdatedDto = new TaskDto(task1.getFrontId(),"task1 updated", "task1 description updated", false);

        Assert.assertEquals(ResponseEntity.notFound().build(), taskService.updateTask(token, taskUpdatedDto));

        Optional<Task> receivedTask = taskRepository.findById(task1.getId());

        Assert.assertEquals(task1.toString(), receivedTask.get().toString());

        userRepository.delete(user1);
    }

    @Test
    public void updateTaskWithMistakenId(){
        String token = generateToken();

        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());
        Task task1 = new Task(1,null, "task1", "task1 description", false);

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        TaskDto taskUpdatedDto = new TaskDto(123128630,"task1 updated", "task1 description updated", false);

        Assert.assertEquals(ResponseEntity.notFound().build(), taskService.updateTask(token, taskUpdatedDto));

        Optional<Task> receivedTask = taskRepository.findById(task1.getId());

        Assert.assertEquals(task1.toString(), receivedTask.get().toString());

        userRepository.delete(user1);
    }

    @Test
    public void deleteTask(){
        String token = generateToken();

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        Assert.assertEquals(ResponseEntity.accepted().build(), taskService.deleteTask(token, task1.getFrontId()));
        Assert.assertEquals(Optional.empty(), taskRepository.findById(task1.getId()));

        userRepository.delete(user1);
    }

    @Test
    public void deleteTaskWithUnusedToken(){
        String token = generateToken();
        String unusedToken = generateToken();

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        long taskId = task1.getId();

        Assert.assertEquals(ResponseEntity.notFound().build(), taskService.deleteTask(unusedToken, taskId));
        Assert.assertEquals(task1.toString(), taskRepository.findById(taskId).get().toString());

        userRepository.delete(user1);
    }

    @Test
    public void deleteTaskWhenUserSessionExpired(){
        String token = generateToken();

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        User user1 = new User("user1@email.com", "password1", false, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Collections.singletonList(task1));
        userRepository.save(user1);

        long taskId = task1.getId();

        Assert.assertEquals(ResponseEntity.notFound().build(), taskService.deleteTask(token, taskId));
        Assert.assertEquals(task1.toString(), taskRepository.findById(taskId).get().toString());

        userRepository.delete(user1);
    }

    @Test
    public void deleteTaskWithMistakenId(){
        String token = generateToken();

        Task task1 = new Task(1,null, "task1", "task1 description", false);
        User user1 = new User("user1@email.com", "password1", true, token,
                LocalDateTime.now(), new ArrayList<>());

        user1.addTasks(Arrays.asList(task1));
        userRepository.save(user1);

        int taskId = 1410263;

        Assert.assertEquals(ResponseEntity.notFound().build(), taskService.deleteTask(token, taskId));
        Assert.assertEquals(task1.toString(), taskRepository.findById(task1.getId()).get().toString());

        userRepository.delete(user1);
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