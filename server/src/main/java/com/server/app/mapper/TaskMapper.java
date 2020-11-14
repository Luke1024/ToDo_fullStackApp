package com.server.app.mapper;

import com.server.app.domain.Task;
import com.server.app.domain.TaskCreateUpdateDto;

public class TaskMapper {
    public Task mapToTaskFromDto(TaskCreateUpdateDto taskCreateUpdateDto){
        return new Task();
    };
}
