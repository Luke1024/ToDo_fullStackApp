package com.server.app.controller;

import com.server.app.domain.dto.admin.ExtendedTaskDto;
import com.server.app.domain.dto.admin.UserDto;
import com.server.app.service.admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping(value = "/users")
    public List<UserDto> getUsers(){
        return adminService.getUsers();
    }

    @GetMapping(value = "/users/{daysFrom}")
    public List<UserDto> getUsersFirstActiveNoLaterThan(@PathVariable int daysFrom){
        return adminService.getUsersFirstActiveNoLaterThan(daysFrom);
    }

    @GetMapping(value = "/tasks_by_user/{id}")
    public List<ExtendedTaskDto> getTasksByUserId(@PathVariable Long id){
        return adminService.getTasksByUserId(id);
    }
}
