package com.server.app.domain;

public class TaskDto {
    private int frontId;
    private String name;
    private String description;

    public TaskDto() {
    }

    public TaskDto(int frontId, String name, String description) {
        this.frontId = frontId;
        this.name = name;
        this.description = description;
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
}
