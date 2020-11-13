package com.server.app.domain;

import com.server.app.domain.Session;
import com.server.app.domain.Task;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String userName;
    private String userEmail;
    private String password;
    private Optional<Session> session;
    private List<Task> taskList;

    public User(String userName, String userEmail, String password, Optional<Session> session, List<Task> taskList) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.password = password;
        this.session = session;
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

    public Optional<Session> getSession() {
        return session;
    }

    public List<Task> getTaskList() {
        return taskList;
    }
}
