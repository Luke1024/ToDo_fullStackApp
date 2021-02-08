package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.mapper.TaskMapper;
import com.server.app.repository.TaskRepository;
import com.server.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskMapper taskMapper;

    private Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

    public ResponseEntity<List<TaskDto>> getTasks(String token){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()) {
            List<Task> taskList = taskRepository.findAvailableTasksByUserId(user.get().getId());
            List<TaskDto> taskDtos = taskMapper.mapToTaskDtoList(taskList);
            return ResponseEntity.ok(taskDtos);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<String> saveTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskSaving(user.get(), taskDto);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<String> updateTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskUpdate(user.get(), taskDto);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<String> deleteTask(String token, long frontId) {
        Optional<User> user = userRepository.findLoggedUserByToken(token);

        if (user.isPresent()) {
            Optional<Task> foundTask = taskRepository.findAvailableTaskByUserIdAndTaskFrontId(user.get().getId(), frontId);
            if (foundTask.isPresent()) {
                foundTask.get().setDeleted(true);
                taskRepository.save(foundTask.get());
                return ResponseEntity.accepted().build();
            } else {
                LOGGER.warn("The user has no tasks.");
                return ResponseEntity.notFound().build();
            }
        }
        LOGGER.warn("User with token: " + token + " not found.");
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<StringDto> processWithTaskSaving(User user, TaskDto taskDto){
        user.addTasks(Collections.singletonList(taskMapper.mapToTaskFromDto(taskDto)));
        userRepository.save(user);
        return new ResponseEntity<>(new StringDto("Task saved."), HttpStatus.ACCEPTED);
    }

    private ResponseEntity<StringDto> processWithTaskUpdate(User userWithTaskToUpdate, TaskDto taskDto){
        Optional<Task> taskToUpdateOptional = findTask(userWithTaskToUpdate, taskDto);

        if(taskToUpdateOptional.isPresent()) {
            Task taskToUpdate = taskToUpdateOptional.get();
            taskToUpdate.setFrontId(taskDto.getFrontId());
            taskToUpdate.setTaskName(taskDto.getName());
            taskToUpdate.setTaskDescription(taskDto.getDescription());
            taskToUpdate.setDone(taskDto.isDone());
            taskRepository.save(taskToUpdate);
            return new ResponseEntity<>(new StringDto("Task updated."), HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(new StringDto("Task not found."), HttpStatus.NOT_FOUND);
        }
    }

    private Optional<Task> findTask(User userWithTaskToUpdate, TaskDto taskDto){
        return taskRepository.findAvailableTaskByUserIdAndTaskFrontId(userWithTaskToUpdate.getId(), taskDto.getFrontId());
    }
}
