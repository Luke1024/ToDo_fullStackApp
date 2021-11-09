package com.server.app.controller;

import com.google.gson.Gson;
import com.server.app.domain.dto.TaskDto;
import com.server.app.service.TaskService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.is;

@RunWith(SpringRunner.class)
@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    private Gson gson = new Gson();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    public void getTasks() throws Exception {
        TaskDto taskDto1 = new TaskDto(34,"task name 1","task description 1", false);
        TaskDto taskDto2 = new TaskDto(35, "task name 2", "task description 2", true);
        List<TaskDto> taskDtos = new ArrayList<>(Arrays.asList(taskDto1, taskDto2));
        ResponseEntity<List<TaskDto>> responseEntity = ResponseEntity.ok(taskDtos);

        when(taskService.getTasks(anyString())).thenReturn(responseEntity);

        mockMvc.perform(get("/toDo/tasks/token")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(34)))
                .andExpect(jsonPath("$[0].name", is("task name 1")))
                .andExpect(jsonPath("$[1].description", is("task description 2")));
    }

    @Test
    public void saveTask() throws Exception {

        when(taskService.saveTask(anyString(), any(TaskDto.class))).thenReturn(ResponseEntity.accepted().build());

        mockMvc.perform(post("/toDo/tasks/token")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(gson.toJson(new TaskDto(1,"","",true))))
                .andExpect(status().isAccepted());
    }

    @Test
    public void updateTask() throws Exception {

        when(taskService.updateTask(anyString(), any(TaskDto.class))).thenReturn(ResponseEntity.accepted().build());

        mockMvc.perform(put("/toDo/tasks/token")
            .contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("UTF-8")
            .content(gson.toJson(new TaskDto(1, "", "", true))))
                .andExpect(status().isAccepted());
    }

    @Test
    public void deleteTask() throws Exception {

        when(taskService.deleteTask(anyString(), anyLong())).thenReturn(ResponseEntity.accepted().build());

        mockMvc.perform(delete("/toDo/tasks/token/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isAccepted());
    }
}