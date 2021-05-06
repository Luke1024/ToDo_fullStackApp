package com.server.app.controller;

import com.server.app.domain.StringDto;
import com.server.app.domain.TaskDto;
import com.server.app.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

    @GetMapping(value = "/tasks/{token}")
    public ResponseEntity<List<TaskDto>> getTasks(@PathVariable String token){
        return taskService.getTasks(token);
    }

    @GetMapping(value = "/tasks/done/{token}")
    public ResponseEntity<List<TaskDto>> getTasksDone(@PathVariable String token) {
        return taskService.getTasksDone(token);
    }

    @GetMapping(value = "/tasks/todo/{token}")
    public ResponseEntity<List<TaskDto>> getTasksToDo(@PathVariable String token) {
        return taskService.getTasksTodo(token);
    }


    @PostMapping(value = "/tasks/{token}")
    public ResponseEntity<TaskDto> saveTask(@PathVariable String token, @RequestBody TaskDto taskDto){
        LOGGER.info("Saving task with token: " + token + " " + "Task " + taskDto.toString());
        return taskService.saveTask(token, taskDto);
    }

    @PostMapping(value = "/tasks/array/{token}")
    public ResponseEntity<List<TaskDto>> saveTasksArray(@PathVariable String token, @RequestBody List<TaskDto> taskDtoList){
        return taskService.saveTasksArray(token, taskDtoList);
    }

    @PutMapping(value = "/tasks/{token}")
    public ResponseEntity<StringDto> updateTask(@PathVariable String token, @RequestBody TaskDto taskDto){
        LOGGER.info("Updating task with token: " + token + " " + "Task " + taskDto.toString());
        return taskService.updateTask(token, taskDto);
    }

    @DeleteMapping(value = "/tasks/{token}/{id}")
    public ResponseEntity<StringDto> deleteTask(@PathVariable String token, @PathVariable long id){
        LOGGER.info("Deleting task with token " + token + " , with id: " + id);
        return taskService.deleteTask(token, id);
    }
}

