package com.server.app.controller;

import com.server.app.domain.TaskDto;
import com.server.app.service.ServiceResponse;
import com.server.app.service.TaskService;
import com.server.app.domain.TaskCrudDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin("*")
@RestController
@RequestMapping("/toDo")
public class TaskController {
    private Logger logger = Logger.getLogger(TaskController.class.getName());

    @Autowired
    private TaskService taskService;

    @GetMapping(value = "/tasks/{token}")
    public ResponseEntity<List<TaskDto>> getTasks(@RequestParam String token){
        return new ResponseEntity<>(taskService.getTasks(token), HttpStatus.OK);
    }

    @PostMapping(value = "/tasks")
    public ResponseEntity<String> postTask(@RequestBody TaskCrudDto taskCrudDto){
        logger.log(Level.INFO, "Task received : " + taskCrudDto.getName() + "  " + taskCrudDto.getDescription());
        ServiceResponse response = taskService.saveTask(taskCrudDto);
        return new ResponseEntity<>(response.getMessage(), response.getHttpStatus());
    }

    @PostMapping(value = "/tasks")
    public ResponseEntity<String> updateTask(@RequestBody TaskCrudDto taskCrudDto){
        ServiceResponse response = taskService.updateTask(taskCrudDto);
        return new ResponseEntity<>(response.getMessage(), response.getHttpStatus());
    }

    @DeleteMapping(value = "/tasks")
    public ResponseEntity<String> deleteTask(@RequestBody TaskCrudDto taskCrudDto){
        ServiceResponse response = taskService.deleteTask(taskCrudDto);
        return new ResponseEntity<>(response.getMessage(), response.getHttpStatus());
    }
}

