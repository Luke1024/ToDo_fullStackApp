package com.server.app.controller;

import com.server.app.domain.StringDto;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/toDo")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping(value = "/token", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StringDto> receiveToken(){
        return userService.createGuestUserAndGenerateToken();
    }

    @PostMapping(value = "/login/{token}")
    public ResponseEntity<StringDto> login(@PathVariable String token, @RequestBody UserCredentialsDto userCredentialsDto){
        return userService.loginUserAndGenerateNewToken(token, userCredentialsDto);
    }

    @PostMapping(value = "/register/{token}")
    public ResponseEntity<StringDto> register(@PathVariable String token, @RequestBody UserCredentialsDto userCredentialsDto){
        return userService.registerUser(token, userCredentialsDto);
    }

    @GetMapping(value = "/logout/{token}")
    public ResponseEntity<StringDto> logout(@PathVariable String token){
        return userService.logoutUser(token);
    }
}
