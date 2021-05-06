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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public ResponseEntity<List<TaskDto>> getTasksDone(String token){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()) {
            List<Task> taskList = taskRepository.findAvailableTasksByUserIdDone(user.get().getId());
            List<TaskDto> taskDtos = taskMapper.mapToTaskDtoList(taskList);
            return ResponseEntity.ok(taskDtos);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<List<TaskDto>> getTasksTodo(String token){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()) {
            List<Task> taskList = taskRepository.findAvailableTasksByUserIdTodo(user.get().getId());
            List<TaskDto> taskDtos = taskMapper.mapToTaskDtoList(taskList);
            return ResponseEntity.ok(taskDtos);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<TaskDto> saveTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskSaving(user.get(), taskDto);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return new ResponseEntity<>(new TaskDto(), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<List<TaskDto>> saveTasksArray(String token, List<TaskDto> taskDtoList){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTasksArraySaving(user.get(), taskDtoList);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<StringDto> updateTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskUpdate(user.get(), taskDto);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return new ResponseEntity<>(new StringDto("User's session expired or logged out."), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<StringDto> deleteTask(String token, long frontId) {
        Optional<User> user = userRepository.findLoggedUserByToken(token);

        if (user.isPresent()) {
            Optional<Task> foundTask = taskRepository.findAvailableTaskByUserIdAndTaskId(user.get().getId(), frontId);
            if (foundTask.isPresent()) {
                foundTask.get().setDeleted(true);
                taskRepository.save(foundTask.get());
                return new ResponseEntity<>(new StringDto("Task succesfully deleted."), HttpStatus.ACCEPTED);
            } else {
                LOGGER.warn("Task not found.");
                return new ResponseEntity<>(new StringDto("Task not found."), HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>(new StringDto("User's session expired or logged out."), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<TaskDto> processWithTaskSaving(User user, TaskDto taskDto){
        Task taskToSave = taskMapper.mapToTaskFromDto(taskDto);
        taskToSave.setUser(user);
        Task taskSavedWithId = taskRepository.save(taskToSave);
        TaskDto dtoWithId = taskMapper.mapToTaskDto(taskSavedWithId);
        return ResponseEntity.ok(dtoWithId);
    }

    private ResponseEntity<List<TaskDto>> processWithTasksArraySaving(User user, List<TaskDto> taskDtoList){
        List<Task> tasksToSave = taskMapper.mapToTaskList(taskDtoList);
        tasksToSave.stream().forEach(task -> task.setUser(user));
        Iterable<Task> tasksWithId = taskRepository.saveAll(tasksToSave);
        List<Task> taskList = new ArrayList<>();
        tasksWithId.forEach(taskList::add);
        List<TaskDto> dtoWithId = taskMapper.mapToTaskDtoList(taskList);
        return ResponseEntity.ok(dtoWithId);
    }

    private ResponseEntity<StringDto> processWithTaskUpdate(User userWithTaskToUpdate, TaskDto taskDto){
        Optional<Task> taskToUpdateOptional = findTask(userWithTaskToUpdate, taskDto);

        if(taskToUpdateOptional.isPresent()) {
            Task taskToUpdate = taskToUpdateOptional.get();
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
        return taskRepository.findAvailableTaskByUserIdAndTaskId(userWithTaskToUpdate.getId(), taskDto.getId());
    }
}
