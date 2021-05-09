package com.server.app.domain;

import com.server.app.service.UserServiceSettings;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@NamedNativeQuery(
        name = "User.findUserByToken",
        query = "SELECT * FROM user WHERE token =:TOKEN",
        resultClass = User.class
)
@NamedNativeQuery(
        name = "User.findByEmail",
        query = "SELECT * FROM user WHERE user_email =:EMAIL",
        resultClass = User.class
)

@Entity
public class User {

    @Autowired
    @Transient
    private UserServiceSettings settings;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private TypeOfUser typeOfUser;

    //credentials
    private String userEmail;
    private String password;

    //session data
    private String token;
    private LocalDateTime sessionActiveTo;


    @OneToMany(targetEntity = Task.class,
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    @OrderColumn
    private List<Task> taskList;


    public User() {
        typeOfUser = TypeOfUser.INACTIVE;
    }

    public void creategGuestUser(String token) {
        typeOfUser = TypeOfUser.GUEST;
        executeLogIn(token);
    }

    public boolean registerUser(UserCredentialsDto userCredentialsDto){
        if(typeOfUser == TypeOfUser.GUEST) {
            typeOfUser = TypeOfUser.REGISTERED;
            userEmail = userCredentialsDto.getUserEmail();
            password = userCredentialsDto.getUserPassword();
            return true;
        }else return false;
    }

    public boolean logInUser(String password, String token){
        if(isLogged()){
            if(passwordOk(password)){
                executeLogIn(token);
                return true;
            }
        }
        return false;
    }

    public boolean logOutUser(){
        if(isLogged()){
            token = "";
            return true;
        } else return false;
    }

    public List<Task> getTaskList() {
        return taskList;
    }

    public void addTasks(List<Task> tasks){
        for(Task task : tasks){
            task.setUser(this);
        }
    }

    public Long getId() {
        return id;
    }

    private boolean passwordOk(String password){
        if(this.password == password) return true;
        else return false;
    }

    private boolean isLogged() {
        if(token.length()==settings.getAcceptTokenLength()) return true;
        else return false;
    }

    private boolean executeLogIn(String token){
        sessionActiveTo = LocalDateTime.now().plusHours(settings.getSessionActiveHours());
        this.token = token;
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userEmail='" + userEmail + '\'' +
                ", password='" + password + '\'' +
                ", token='" + token + '\'' +
                ", taskList=" + taskList +
                '}';
    }
}
