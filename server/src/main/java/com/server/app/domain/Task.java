package com.server.app.domain;

import javax.persistence.*;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int frontId;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "USER_ID")
    private User user;
    private String taskName;
    private String taskDescription;
    private boolean done;

    public Task() {}

    public Task(int frontId, User user, String taskName, String taskDescription, boolean done) {
        this.frontId = frontId;
        this.user = user;
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

    public User getUser() {
        return user;
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
