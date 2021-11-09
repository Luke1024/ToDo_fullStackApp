package com.server.app.domain.dto.admin;

import java.time.LocalDateTime;

public class SessionDto {
    private Long id;
    private String token;
    private LocalDateTime sessionActiveTo;
    private LocalDateTime sessionOpen;
    private LocalDateTime sessionClosed;
    private Long userId;

    public SessionDto() {
    }

    public SessionDto(Long id, String token, LocalDateTime sessionActiveTo,
                      LocalDateTime sessionOpen, LocalDateTime sessionClosed, Long userId) {
        this.id = id;
        this.token = token;
        this.sessionActiveTo = sessionActiveTo;
        this.sessionOpen = sessionOpen;
        this.sessionClosed = sessionClosed;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getSessionActiveTo() {
        return sessionActiveTo;
    }

    public LocalDateTime getSessionOpen() {
        return sessionOpen;
    }

    public LocalDateTime getSessionClosed() {
        return sessionClosed;
    }

    public Long getUserId() {
        return userId;
    }
}
