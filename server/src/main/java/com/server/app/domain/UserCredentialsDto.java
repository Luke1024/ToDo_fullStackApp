package com.server.app.domain;

public class UserCredentialsDto {

    private String userEmail;
    private String userPassword;

    public UserCredentialsDto() {
    }

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
