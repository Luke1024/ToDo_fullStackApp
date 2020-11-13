package com.server.app.domain;

public class UserDto {
    private String userToken;
    private String userName;
    private String userPassword;

    public UserDto(String userToken, String userName, String userPassword) {
        this.userToken = userToken;
        this.userName = userName;
        this.userPassword = userPassword;
    }

    public String getUserToken() {
        return userToken;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserPassword() {
        return userPassword;
    }
}
