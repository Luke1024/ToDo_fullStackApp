package com.server.app.controller;


import com.google.gson.Gson;
import com.server.app.domain.StringDto;
import com.server.app.domain.UserCredentialsDto;
import com.server.app.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class UserControllerTest {

    private Gson gson = new Gson();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void receiveToken() throws Exception {
        when(userService.createGuestUserAndGenerateToken()).thenReturn(ResponseEntity.ok(new StringDto("qwerty")));

        mockMvc.perform(get("/toDo/token"))
                .andExpect(content().string(containsString("qwerty")))
                .andExpect(status().isOk());
    }

    @Test
    public void login() throws Exception {
        when(userService.loginUserAndGenerateNewToken(anyString(), any(UserCredentialsDto.class)))
                .thenReturn(ResponseEntity.ok("qwerty"));

        mockMvc.perform(post("/toDo/login/token")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(gson.toJson(new UserCredentialsDto("email", "password"))))
                .andExpect(content().string(containsString("qwerty")))
                .andExpect(status().isOk());
    }

    @Test
    public void register() throws Exception {
        when(userService.registerUser(anyString(), any(UserCredentialsDto.class))).thenReturn(ResponseEntity.accepted().build());

        mockMvc.perform(post("/toDo/register/token")
            .contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("UTF-8")
            .content(gson.toJson(new UserCredentialsDto("email", "password"))))
            .andExpect(status().isAccepted());
    }

    @Test
    public void logout() throws Exception {
        when(userService.logoutUser(anyString())).thenReturn(ResponseEntity.accepted().build());

        mockMvc.perform(post("/toDo/logout/token"))
                .andExpect(status().isAccepted());
    }
}