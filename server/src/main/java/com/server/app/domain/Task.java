package com.server.app.domain;

import javax.persistence.*;

@NamedNativeQuery(
        name = "Task.findAvailableTaskByUserIdAndTaskFrontId",
        query = "SELECT * FROM task WHERE user_id =:USER_ID AND front_id=:FRONT_ID AND deleted=false",
        resultClass = Task.class
)

@NamedNativeQuery(
        name = "Task.findAvailableTasksByUserId",
        query = "SELECT * FROM task WHERE user_id = :USER_ID AND deleted=false",
        resultClass = Task.class
)

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long frontId;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "USER_ID")
    private User user;
    private String taskName;
    private String taskDescription;
    private boolean done;
    private boolean deleted;

    public Task() {}

    public Task(Long frontId,User user, String taskName, String taskDescription, boolean done) {
        this.frontId = frontId;
        setUser(user);
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.done = done;
        this.deleted = false;
    }

    public Long getId() {
        return id;
    }

    public Long getFrontId() {
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

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public boolean isDone() {
        return done;
    }

    public void setFrontId(Long frontId) {
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
