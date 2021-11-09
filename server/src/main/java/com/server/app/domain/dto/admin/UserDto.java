package com.server.app.domain.dto.admin;

import java.time.LocalDateTime;
import java.util.Optional;

public class UserDto {
    private Long userId;
    private Optional<LocalDateTime> firstActive;
    private Optional<LocalDateTime> lastActive;
    private String typeOfUser;
    private String userEmail;
    private String password;
    private int tasks;

    public UserDto() {
    }

    public UserDto(Long userId, Optional<LocalDateTime> firstActive, Optional<LocalDateTime> lastActive,
                   String typeOfUser, String userEmail, String password, int tasks) {
        this.userId = userId;
        this.firstActive = firstActive;
        this.lastActive = lastActive;
        this.typeOfUser = typeOfUser;
        this.userEmail = userEmail;
        this.password = password;
        this.tasks = tasks;
    }

    public Long getUserId() {
        return userId;
    }

    public Optional<LocalDateTime> getFirstActive() {
        return firstActive;
    }

    public Optional<LocalDateTime> getLastActive() {
        return lastActive;
    }

    public String getTypeOfUser() {
        return typeOfUser;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getPassword() {
        return password;
    }

    public int getTasks() {
        return tasks;
    }
}
