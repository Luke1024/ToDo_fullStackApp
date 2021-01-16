package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.mapper.TaskMapper;
import com.server.app.repository.TaskRepository;
import com.server.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public ResponseEntity<List<TaskDto>> getTasks(String token){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()) {
            List<TaskDto> taskDtos = taskMapper.mapToTaskDtoList(user.get().getTaskList());
            return ResponseEntity.ok(taskDtos);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<String> saveTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskSaving(user.get(), taskDto);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<String> updateTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskUpdate(user.get(), taskDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<String> deleteTask(String token, long id) {
        Optional<User> user = userRepository.findLoggedUserByToken(token);

        if (user.isPresent()) {
            List<Task> userTaskList = user.get().getTaskList();
            if ( ! (userTaskList.isEmpty() || userTaskList == null)) {
                Optional<Task> foundTask = userTaskList.stream().filter(task -> task.getId() == id).findFirst();
                if (foundTask.isPresent()) {
                    taskRepository.delete(foundTask.get());
                    return ResponseEntity.accepted().build();
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<String> processWithTaskSaving(User user, TaskDto taskDto){
        user.addTasks(Collections.singletonList(taskMapper.mapToTaskFromDto(taskDto)));
        userRepository.save(user);
        return ResponseEntity.accepted().build();
    }

    private ResponseEntity<String> processWithTaskUpdate(User userWithTaskToUpdate, TaskDto taskDto){
        Optional<Task> taskToUpdateOptional = findTask(userWithTaskToUpdate, taskDto);

        if(taskToUpdateOptional.isPresent()) {
            Task taskToUpdate = taskToUpdateOptional.get();
            taskToUpdate.setFrontId(taskDto.getFrontId());
            taskToUpdate.setTaskName(taskDto.getName());
            taskToUpdate.setTaskDescription(taskDto.getDescription());
            taskToUpdate.setDone(taskDto.isDone());
            taskRepository.save(taskToUpdate);
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private Optional<Task> findTask(User userWithTaskToUpdate, TaskDto taskDto){
        List<Task> userTaskList = userWithTaskToUpdate.getTaskList();
        if(userTaskList.isEmpty() || userTaskList == null){
            return Optional.empty();
        } else {
            return userTaskList.stream().filter(task -> task.getFrontId()==taskDto.getFrontId()).findFirst();
        }
    }
}
