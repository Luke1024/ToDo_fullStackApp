package com.server.app.mapper;

import com.server.app.domain.Task;
import com.server.app.domain.dto.TaskDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {
    public Task mapToTaskFromDto(TaskDto taskDto){
        return new Task(null, taskDto.getName(), taskDto.getDescription(), taskDto.isDone());
    }

    public List<TaskDto> mapToTaskDtoList(List<Task> taskList){
        if(taskList == null || taskList.isEmpty()) return new ArrayList<>();
        else return taskList.stream().map(task -> new TaskDto(task.getId(), task.getTaskName(), task.getTaskDescription(), task.isDone()))
                .collect(Collectors.toList());
    }

    public List<Task> mapToTaskList(List<TaskDto> taskDtoList){
        if(taskDtoList == null || taskDtoList.isEmpty()) return new ArrayList<>();
        else return  taskDtoList.stream().map(taskDto -> new Task(null, taskDto.getName(), taskDto.getDescription(), taskDto.isDone()))
                .collect(Collectors.toList());
    }

    public TaskDto mapToTaskDto(Task task){
        return new TaskDto(task.getId(), task.getTaskName(), task.getTaskDescription(), task.isDone());
    }
}
