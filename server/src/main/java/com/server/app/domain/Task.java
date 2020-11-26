package com.server.app.domain;

import jdk.jfr.Name;

import javax.persistence.*;


//check logged number
@NamedNativeQuery(
        name = "Task.findTasksByActiveToken",
        query = "SELECT * FROM task WHERE token =:TOKEN and logged = 1",
        resultClass = Task.class
)
@NamedNativeQuery(
        name = "Task.findTasksByActiveTokenAndFrontId",
        query = "SELECT * FROM task WHERE token =:TOKEN and logged = 1 and front_id =:FRONT_ID",
        resultClass = Task.class
)

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

    public void setId(Long id) {
        this.id = id;
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
}
