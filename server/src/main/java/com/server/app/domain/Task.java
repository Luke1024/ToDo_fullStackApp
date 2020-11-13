package com.server.app.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int frontId;
    private String taskName;
    private String taskDescription;
    private boolean done;

    public Task(int frontId, String taskName, String taskDescription) {
        this.frontId = frontId;
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.done = false;
    }

    public Task(Long id, int frontId, String taskName,
                String taskDescription, boolean done) {
        this.id = id;
        this.frontId = frontId;
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.done = done;
    }

    public Long getId() {
        return id;
    }

    public int getFrontId() {
        return frontId;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public boolean isDone() {
        return done;
    }
}
