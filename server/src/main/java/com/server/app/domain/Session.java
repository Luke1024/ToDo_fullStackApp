package com.server.app.domain;

import javax.persistence.*;
import java.time.LocalDateTime;

@NamedNativeQuery(
        name = "User.findSessionByToken",
        query = "SELECT * FROM session WHERE token=:TOKEN",
        resultClass = Session.class
)

@Entity
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String token;
    private LocalDateTime sessionActiveTo;
    private LocalDateTime sessionOpen;
    private LocalDateTime sessionClosed;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "USER_ID")
    private User user;

    public Session() {
    }

    public Session(User user, String token, LocalDateTime sessionActiveTo, LocalDateTime sessionOpen){
        setUser(user);
        this.token = token;
        this.sessionOpen = sessionOpen;
        this.sessionActiveTo = sessionActiveTo;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        if(user != null){
            user.getSessionList().add(this);
        } else if (this.user != null){
            this.user.getSessionList().remove(this);
        }
        this.user = user;
    }
}
