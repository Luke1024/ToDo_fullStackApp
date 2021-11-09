package com.server.app.domain.dto;

public class TaskDto {
    private long id;
    private String name;
    private String description;
    private boolean done;

    public TaskDto() {
    }

    public TaskDto(long id, String name, String description, boolean done) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.done = done;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isDone() {
        return done;
    }

    @Override
    public String toString() {
        return "TaskDto{" +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", done=" + done +
                '}';
    }
}
