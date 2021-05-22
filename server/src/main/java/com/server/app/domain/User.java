package com.server.app.domain;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@NamedNativeQuery(
        name = "User.findByEmail",
        query = "SELECT * FROM user WHERE user_email =:EMAIL",
        resultClass = User.class
)
@NamedNativeQuery(
        name = "User.findUserByEmailAndPassword",
        query = "SELECT * FROM user WHERE user_email =:EMAIL AND password =:PASSWORD",
        resultClass = User.class
)

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private TypeOfUser typeOfUser;

    //credentials
    private String userEmail;
    private String password;

    @OneToMany(targetEntity = Task.class,
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    @OrderColumn
    private List<Task> taskList = new ArrayList<>();


    @OneToMany(targetEntity = Session.class,
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @OrderColumn
    private List<Session> sessionList = new ArrayList<>();

    public User() {

    }

    public void addTasks(List<Task> tasks){
        for(Task task : tasks){
            task.setUser(this);
        }
    }

    public void addSession(Session session){
        session.setUser(this);
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

    public List<Session> getSessionList() {
        return sessionList;
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
