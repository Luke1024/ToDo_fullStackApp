package com.server.app.domain;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

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
}
