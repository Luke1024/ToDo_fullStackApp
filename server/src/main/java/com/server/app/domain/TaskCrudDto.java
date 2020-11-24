package com.server.app.domain;

public class TaskCrudDto {
    private int frontId;
    private String userToken;
    private String name;
    private String description;

    public TaskCrudDto(int frontId, String userToken, String name, String description) {
        this.frontId = frontId;
        this.userToken = userToken;
        this.name = name;
        this.description = description;
    }

    public int getFrontId() {
        return frontId;
    }

    public String getUserToken() {
        return userToken;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
