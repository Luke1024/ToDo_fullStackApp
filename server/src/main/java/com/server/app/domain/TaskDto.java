package com.server.app.domain;

public class TaskDto {
    private int frontId;
    private String name;
    private String description;
    private boolean done;

    public TaskDto() {
    }

    public TaskDto(int frontId, String name, String description, boolean done) {
        this.frontId = frontId;
        this.name = name;
        this.description = description;
        this.done = done;
    }


    public int getFrontId() {
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
}
