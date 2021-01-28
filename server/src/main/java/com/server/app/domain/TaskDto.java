package com.server.app.domain;

public class TaskDto {
    private long frontId;
    private String name;
    private String description;
    private boolean done;

    public TaskDto() {
    }

    public TaskDto(long frontId, String name, String description, boolean done) {
        this.frontId = frontId;
        this.name = name;
        this.description = description;
        this.done = done;
    }

    public long getFrontId() {
        return frontId;
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
                "frontId=" + frontId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", done=" + done +
                '}';
    }
}
