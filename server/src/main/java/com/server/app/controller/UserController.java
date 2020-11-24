package com.server.app.controller;

import com.server.app.domain.UserDto;
import com.server.app.service.ServiceResponse;
import com.server.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/toDo")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping(value = "/token")
    public String receiveToken(){
        return userService.createGuestUserAndGenerateToken();
    }

    @PostMapping(value = "/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto){
        ServiceResponse response = userService.loginUserAndGenerateNewToken(userDto);
        return new ResponseEntity<>(response.getMessage(), response.getHttpStatus());
    }

    @PostMapping(value = "/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto){
        ServiceResponse response = userService.registerUser(userDto);
        return new ResponseEntity<>(response.getMessage(), response.getHttpStatus());
    }

    @PostMapping(value = "logout/{token}")
    public ResponseEntity<String> logout(@RequestParam String token){
        ServiceResponse response = userService.logoutUser(token);
        return new ResponseEntity<>(response.getMessage(), response.getHttpStatus());
    }
}
