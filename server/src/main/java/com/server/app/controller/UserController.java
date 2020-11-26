package com.server.app.controller;

import com.server.app.domain.UserCredentialsDto;
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
    public ResponseEntity<String> receiveToken(){
        return userService.createGuestUserAndGenerateToken();
    }

    @PostMapping(value = "/login/{token}/")
    public ResponseEntity<String> login(@RequestParam String token, @RequestBody UserCredentialsDto userCredentialsDto){
        return userService.loginUserAndGenerateNewToken(token, userCredentialsDto);
    }

    @PostMapping(value = "/register/{token}/")
    public ResponseEntity register(@RequestParam String token, @RequestBody UserCredentialsDto userCredentialsDto){
        return userService.registerUser(token, userCredentialsDto);
    }

    @PostMapping(value = "logout/{token}")
    public ResponseEntity logout(@RequestParam String token){
        return userService.logoutUser(token);
    }
}
