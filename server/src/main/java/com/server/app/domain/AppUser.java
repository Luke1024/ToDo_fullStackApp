package com.server.app.domain;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private TypeOfUser typeOfUser;

    //credentials
    private String userEmail;
    private String password;

    @OneToMany(targetEntity = Task.class,
            mappedBy = "appUser",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    @OrderColumn
    private List<Task> taskList = new ArrayList<>();


    @OneToMany(targetEntity = AppSession.class,
            mappedBy = "appUser",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @OrderColumn
    private List<AppSession> appSessionList = new ArrayList<>();

    public AppUser() {

    }

    public void addTasks(List<Task> tasks){
        for(Task task : tasks){
            task.setAppUser(this);
        }
    }

    public void addSession(AppSession appSession){
        appSession.setAppUser(this);
    }

    public Long getId() {
        return id;
    }

    public TypeOfUser getTypeOfUser() {
        return typeOfUser;
    }

    public void setTypeOfUser(TypeOfUser typeOfUser) {
        this.typeOfUser = typeOfUser;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<AppSession> getAppSessionList() {
        return appSessionList;
    }

    public List<Task> getTaskList() {
        return taskList;
    }

    public void setTaskList(List<Task> taskList) {
        this.taskList = taskList;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userEmail='" + userEmail + '\'' +
                ", password='" + password + '\'' +
                ", taskList=" + taskList +
                '}';
    }
}
