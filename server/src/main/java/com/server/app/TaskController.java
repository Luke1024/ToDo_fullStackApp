package com.server.app;

import org.springframework.web.bind.annotation.*;

import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin("*")
@RestController
@RequestMapping("toDo")
public class TaskController {
    private Logger logger = Logger.getLogger(TaskController.class.getName());

    @PostMapping(value = "/tasks")
    public void receiveTask(@RequestBody TaskDto taskDto) {
        logger.log(Level.INFO, "Task received : " + taskDto.getTask() + "  " + taskDto.getDescription());
    }
}

class TaskDto {
    private String task;
    private String description;

    public TaskDto(String task, String description) {
        this.task = task;
        this.description = description;
    }

    public String getTask() {
        return task;
    }

    public String getDescription() {
        return description;
    }
}
