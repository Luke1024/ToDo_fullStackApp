package com.server.app.domain;

import javax.persistence.*;

@NamedNativeQuery(
        name = "Task.findAvailableTaskByUserIdAndTaskId",
        query = "SELECT * FROM task WHERE user_id =:USER_ID AND id=:ID AND deleted=false",
        resultClass = Task.class
)

@NamedNativeQuery(
        name = "Task.findAvailableTasksByUserId",
        query = "SELECT * FROM task WHERE user_id = :USER_ID AND deleted=false",
        resultClass = Task.class
)

@NamedNativeQuery(
        name = "Task.findAvailableTasksByUserIdDone",
        query = "SELECT * FROM task WHERE user_id = :USER_ID AND deleted=false AND done=true",
        resultClass = Task.class
)

@NamedNativeQuery(
        name = "Task.findAvailableTasksByUserIdTodo",
        query = "SELECT * FROM task WHERE user_id = :USER_ID AND deleted=false AND done=false",
        resultClass = Task.class
)

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "USER_ID")
    private User user;
    private String taskName;
    private String taskDescription;
    private boolean done;
    private boolean deleted;

    public Task() {}

    public Task(User user, String taskName, String taskDescription, boolean done) {
        setUser(user);
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.done = done;
        this.deleted = false;
    }

    public Long getId() {
        return id;
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
