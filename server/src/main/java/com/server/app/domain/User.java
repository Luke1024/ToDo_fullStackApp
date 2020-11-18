package com.server.app.domain;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@NamedNativeQuery(
        name = "User.findLoggedUserByToken",
        query = "SELECT * FROM user WHERE token =:TOKEN and logged = 0",
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
    private String userName;
    private String userEmail;
    private String password;
    private boolean logged;
    private String token;
    private LocalDateTime sessionActiveTo;
    @OneToMany(targetEntity = Task.class,
            mappedBy = "user",
            cascade = {CascadeType.ALL},
            fetch = FetchType.EAGER
    )
    private List<Task> taskList;

    public User() {}

    public User(String userName, String userEmail, String password, boolean logged, String token,
                LocalDateTime sessionActiveTo, List<Task> taskList) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.password = password;
        this.logged = logged;
        this.token = token;
        this.sessionActiveTo = sessionActiveTo;
        this.taskList = taskList;
    }

    public void addTasks(List<Task> tasks){
        for(Task task : tasks){
            task.setUser(this);
        }
    }

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getPassword() {
        return password;
    }

    public boolean isLogged() {
        return logged;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getSessionActiveTo() {
        return sessionActiveTo;
    }

    public List<Task> getTaskList() {
        return taskList;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setLogged(boolean logged) {
        this.logged = logged;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setSessionActiveTo(LocalDateTime sessionActiveTo) {
        this.sessionActiveTo = sessionActiveTo;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", password='" + password + '\'' +
                ", logged=" + logged +
                ", token='" + token + '\'' +
                ", taskList=" + taskList +
                '}';
    }
}
