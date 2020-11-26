package com.server.app.mapper;

import com.server.app.domain.Task;
import com.server.app.domain.TaskDto;
import com.server.app.domain.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {
    public Task mapToTaskFromDto(TaskDto taskDto, User user){
        return new Task(taskDto.getFrontId(), user, taskDto.getName(), taskDto.getDescription(), taskDto.isDone());
    };

    public List<TaskDto> mapToTaskDtoList(List<Task> taskList){
        return taskList.stream().map(task -> new TaskDto(task.getFrontId(), task.getTaskName(), task.getTaskDescription(), task.isDone()))
                .collect(Collectors.toList());
    }
}
