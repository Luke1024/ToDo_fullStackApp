package com.server.app.domain;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
public class AppSession {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String token;
    private LocalDateTime sessionActiveTo;
    private LocalDateTime sessionOpen;
    private LocalDateTime sessionClosed;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "APPUSER_ID")
    private AppUser appUser;

    public AppSession() {
    }

    public AppSession(AppUser appUser, String token, LocalDateTime sessionActiveTo, LocalDateTime sessionOpen){
        setAppUser(appUser);
        this.token = token;
        this.sessionOpen = sessionOpen;
        this.sessionActiveTo = sessionActiveTo;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        if(token.length()>=0){
            sessionOpen=LocalDateTime.now();
        }
        if(token.length()==0){
            sessionClosed=LocalDateTime.now();
        }
        this.token = token;
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

    public void setSessionClosed(LocalDateTime sessionClosed) {
        this.sessionClosed = sessionClosed;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        if(appUser != null){
            appUser.getAppSessionList().add(this);
        } else if (this.appUser != null){
            this.appUser.getAppSessionList().remove(this);
        }
        this.appUser = appUser;
    }
}
