package com.server.app.mapper;

import com.server.app.domain.Task;
import com.server.app.domain.TaskCrudDto;
import com.server.app.domain.TaskDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {
    public Task mapToTaskFromDto(TaskCrudDto taskCrudDto){
        return new Task();
    };

    public List<TaskDto> mapToTaskDtoList(List<Task> taskList){
        return taskList.stream().map(task -> new TaskDto(task.getFrontId(), task.getTaskName(), task.getTaskDescription()))
                .collect(Collectors.toList());
    }
}
