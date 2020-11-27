package com.server.app.controller;

import com.server.app.domain.TaskDto;
import com.server.app.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/toDo")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping(value = "/tasks/{token}")
    public ResponseEntity<List<TaskDto>> getTasks(@RequestParam String token){
        return taskService.getTasks(token);
    }

    @PostMapping(value = "/tasks/{token}/")
    public ResponseEntity<String> saveTask(@RequestParam String token, @RequestBody TaskDto taskDto){
        return taskService.saveTask(token, taskDto);
    }

    @PutMapping(value = "/tasks/{token}/")
    public ResponseEntity<String> updateTask(@RequestParam String token, @RequestBody TaskDto taskDto){
        return taskService.updateTask(token, taskDto);
    }

    @DeleteMapping(value = "/tasks/{token}/")
    public ResponseEntity<String> deleteTask(@RequestParam String token, @RequestBody TaskDto taskDto){
        return taskService.deleteTask(token, taskDto);
    }
}

