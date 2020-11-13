package com.server.app.domain;

import java.time.LocalDateTime;

public class Session {
    private String token;
    private LocalDateTime sessionStarted;
    private boolean logged;

    public Session(String token, LocalDateTime sessionStarted, boolean logged) {
        this.token = token;
        this.sessionStarted = sessionStarted;
        this.logged = logged;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getSessionStarted() {
        return sessionStarted;
    }

    public boolean isLogged() {
        return logged;
    }
}
