package com.server.app.domain;

import javax.persistence.*;



@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "APP_USER_ID")
    private AppUser appUser;
    private String taskName;
    private String taskDescription;
    private boolean done;
    private boolean deleted;

    public Task() {}

    public Task(AppUser appUser, String taskName, String taskDescription, boolean done) {
        setAppUser(appUser);
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.done = done;
        this.deleted = false;
    }

    public Long getId() {
        return id;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        if(appUser != null){
            appUser.getTaskList().add(this);
        } else if (this.appUser != null){
            this.appUser.getTaskList().remove(this);
        }
        this.appUser = appUser;
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
