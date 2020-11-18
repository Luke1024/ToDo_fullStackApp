package com.server.app.domain;

public class UserDto {
    private String userToken;
    private String userEmail;
    private String userPassword;

    public UserDto(String userToken, String userEmail, String userPassword) {
        this.userToken = userToken;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
    }

    public String getUserToken() {
        return userToken;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPassword() {
        return userPassword;
    }
}
