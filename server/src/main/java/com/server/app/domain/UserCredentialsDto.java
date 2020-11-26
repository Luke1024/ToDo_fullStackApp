package com.server.app.domain;

public class UserCredentialsDto {

    public UserCredentialsDto() {
    }

    private String userEmail;
    private String userPassword;

    public UserCredentialsDto(String userEmail, String userPassword) {
        this.userEmail = userEmail;
        this.userPassword = userPassword;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPassword() {
        return userPassword;
    }
}
