package com.server.app.controller;

import com.server.app.UserService;
import com.server.app.domain.TaskCreateUpdateDto;
import com.server.app.domain.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin("*")
@RestController
@RequestMapping("/toDo")
public class TaskController {
    private Logger logger = Logger.getLogger(TaskController.class.getName());

    @Autowired
    private UserService userService;

    @PostMapping(value = "/tasks")
    public void receiveTask(@RequestBody TaskCreateUpdateDto taskCreateUpdateDto) {
        logger.log(Level.INFO, "Task received : " + taskCreateUpdateDto.getName() + "  " + taskCreateUpdateDto.getDescription());
        userService.saveUpdateTask(taskCreateUpdateDto);
    }

    @PostMapping(value = "/authorize")
    public String authorize(@RequestBody UserDto userDto) {
        return userService.generateTokenForLoggedUser(userDto);
    }

    @GetMapping(value = "/token")
    public String receiveToken(){
        return userService.generateGuestToken();
    }
}

