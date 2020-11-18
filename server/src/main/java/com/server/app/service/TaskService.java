package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    private Logger logger = Logger.getLogger(TaskService.class.getName());

    public void saveUpdateTask(TaskCreateUpdateDto taskCreateUpdateDto){
        String receivedToken = taskCreateUpdateDto.getUserToken();
        Optional<User> userOptional = getUserWithActiveSessionToken(receivedToken);
        if(userOptional.isPresent()){
            executeTaskSaveUpdate(userOptional.get(), taskCreateUpdateDto);
        }
    }

    private void executeTaskSaveUpdate(User user, TaskCreateUpdateDto taskCreateUpdateDto){
        Optional<Task> task = findTask(taskCreateUpdateDto, taskCreateUpdateDto.getFrontId(), user);
        if(task.isPresent()){

        }
    }

    private Optional<Task> findTask(TaskCreateUpdateDto updateDto, int frontId, User user){
        List<Task> taskList = user.getTaskList();
        for(int i=0; i<taskList.size(); i++){
            if(taskList.get(i).getFrontId()==frontId){
                return Optional.of(taskList.get(i));
            }
        }
        return Optional.empty();
    }

    private Optional<User> getUserWithActiveSessionToken(String receivedToken){

        for(int i=0; i<users.size(); i++){
            Optional<Session> session = users.get(i).getSession();
            if(session.isPresent()){
                if(session.get().isLogged()){
                    if(session.get().getToken().equals(receivedToken)){
                        return Optional.of(users.get(i));
                    }
                }
            }
        }
        return Optional.empty();
    }

    public String generateTokenForLoggedUser(UserDto userDto){
        return generateGuestToken();
    }

    public String generateGuestToken(){
        int leftLimit = 32;
        int rightLimit = 127;
        int targetStringLength = 15;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        String generatedString = buffer.toString();
        logger.log(Level.INFO, "Token generated: " + generatedString);
        return generatedString;
    }

}
