package com.server.app.domain;

import org.springframework.core.annotation.Order;

import javax.persistence.*;

//check logged number

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

    public Task(int frontId,User user, String taskName, String taskDescription, boolean done) {
        setUser(user);
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

    public void setUser(User user) {
        if(user != null){
            user.getTaskList().add(this);
        } else if (this.user != null){
            this.user.getTaskList().remove(this);
        }
        this.user = user;
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

    public void setFrontId(int frontId) {
        this.frontId = frontId;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    @Override
    public String toString() {
        return "Task{" +
                "taskName='" + taskName + '\'' +
                ", taskDescription='" + taskDescription + '\'' +
                ", done=" + done +
                '}';
    }
}
