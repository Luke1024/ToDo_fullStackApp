package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.domain.dto.StringDto;
import com.server.app.domain.dto.TaskDto;
import com.server.app.mapper.TaskMapper;
import com.server.app.repository.SessionRepository;
import com.server.app.repository.TaskRepository;
import com.server.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TaskMapper taskMapper;

    private Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

    public ResponseEntity<List<TaskDto>> getTasks(String token){
        Optional<AppUser> user = getUserByToken(token);
        if(user.isPresent()) {
            List<Task> taskList = taskRepository.findAvailableTasksByUserId(user.get().getId());
            return ResponseEntity.ok(convertTaskListToDto(taskList));
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<List<TaskDto>> getTasksDone(String token){
        Optional<AppUser> user = getUserByToken(token);
        if(user.isPresent()) {
            List<Task> taskList = taskRepository.findAvailableTasksByUserIdDone(user.get().getId());
            return ResponseEntity.ok(convertTaskListToDto(taskList));
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<List<TaskDto>> getTasksTodo(String token){
        Optional<AppUser> user = getUserByToken(token);
        if(user.isPresent()) {
            List<Task> taskList = taskRepository.findAvailableTasksByUserIdTodo(user.get().getId());
            return ResponseEntity.ok(convertTaskListToDto(taskList));
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<TaskDto> saveTask(String token, TaskDto taskDto){
        Optional<AppUser> user = getUserByToken(token);
        if(user.isPresent()){
            return processWithTaskSaving(user.get(), taskDto);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return new ResponseEntity<>(new TaskDto(), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<StringDto> updateTask(String token, TaskDto taskDto){
        Optional<AppUser> user = getUserByToken(token);
        if(user.isPresent()){
            return processWithTaskUpdate(user.get(), taskDto);
        } else {
            LOGGER.warn("User with token: " + token + " not found.");
            return new ResponseEntity<>(new StringDto("User's session expired or logged out."), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<StringDto> deleteTask(String token, long frontId) {
        Optional<AppUser> user = getUserByToken(token);

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

    public Optional<AppUser> getUserByToken(String token){
        Optional<AppSession> sessionOptional = sessionRepository.findSessionByToken(token);

        if(sessionOptional.isPresent()){
            return Optional.of(sessionOptional.get().getAppUser());
        } else return Optional.empty();
    }

    private List<TaskDto> convertTaskListToDto(List<Task> tasks){
        return taskMapper.mapToTaskDtoList(tasks);
    }

    private ResponseEntity<TaskDto> processWithTaskSaving(AppUser appUser, TaskDto taskDto){
        Task taskToSave = taskMapper.mapToTaskFromDto(taskDto);
        taskToSave.setAppUser(appUser);
        Task taskSavedWithId = taskRepository.save(taskToSave);
        TaskDto dtoWithId = taskMapper.mapToTaskDto(taskSavedWithId);
        return ResponseEntity.ok(dtoWithId);
    }

    private ResponseEntity<StringDto> processWithTaskUpdate(AppUser appUserWithTaskToUpdate, TaskDto taskDto){
        Optional<Task> taskToUpdateOptional = findTask(appUserWithTaskToUpdate, taskDto);

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

    private Optional<Task> findTask(AppUser appUserWithTaskToUpdate, TaskDto taskDto){
        return taskRepository.findAvailableTaskByUserIdAndTaskId(appUserWithTaskToUpdate.getId(), taskDto.getId());
    }
}
