package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.mapper.TaskMapper;
import com.server.app.repository.TaskRepository;
import com.server.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskMapper taskMapper;

    private Logger logger = Logger.getLogger(TaskService.class.getName());

    public ResponseEntity<List<TaskDto>> getTasks(String token){
        List<Task> taskList = taskRepository.findTasksByActiveToken(token);
        if(taskList.isEmpty() && taskList == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(taskMapper.mapToTaskDtoList(taskList));
        }
    }

    public ResponseEntity saveTask(String token, TaskDto taskDto){
        Optional<User> user = userRepository.findLoggedUserByToken(token);
        if(user.isPresent()){
            return processWithTaskSaving(user.get(), taskDto);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    private ResponseEntity processWithTaskSaving(User user, TaskDto taskDto){
        Task taskToSave = taskMapper.mapToTaskFromDto(taskDto, user);
        taskRepository.save(taskToSave);
        return ResponseEntity.accepted().build();
    }

    public ResponseEntity updateTask(String token, TaskDto taskDto){
        Optional<Task> taskToUpdate = taskRepository.findTasksByActiveTokenAndFrontId(token, taskDto.getFrontId());
        if(taskToUpdate.isPresent()){
            return processWithTaskUpdate(taskToUpdate.get(), taskDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private ResponseEntity processWithTaskUpdate(Task taskToUpdate, TaskDto taskDto){
        taskToUpdate.setFrontId(taskDto.getFrontId());
        taskToUpdate.setTaskName(taskDto.getName());
        taskToUpdate.setTaskDescription(taskDto.getDescription());
        taskToUpdate.setDone(taskDto.isDone());
        taskRepository.save(taskToUpdate);
        return ResponseEntity.accepted().build();
    }

    public ResponseEntity deleteTask(String token, TaskDto taskDto){
        Optional<Task> taskToDelete = taskRepository.findTasksByActiveTokenAndFrontId(token, taskDto.getFrontId());
        if(taskToDelete.isPresent()){
            taskRepository.delete(taskToDelete.get());
            return ResponseEntity.accepted().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
