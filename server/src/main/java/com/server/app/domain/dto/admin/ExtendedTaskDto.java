package com.server.app.domain.dto.admin;

public class ExtendedTaskDto {
    private long id;
    private String name;
    private String description;
    private boolean done;
    private boolean deleted;

    public ExtendedTaskDto() {
    }

    public ExtendedTaskDto(long id, String name, String description, boolean done, boolean deleted) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.done = done;
        this.deleted = deleted;
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

    public boolean isDeleted() {
        return deleted;
    }
}
