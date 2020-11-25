package com.server.app.service;

import com.server.app.domain.*;
import com.server.app.mapper.TaskMapper;
import com.server.app.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TaskMapper taskMapper;

    private Logger logger = Logger.getLogger(TaskService.class.getName());

    public List<TaskDto> getTasks(String token){
        Optional<User> userOptional = getUserWithActiveSessionToken(token);
        if(userOptional.isPresent()){
            List<Task> taskList = userOptional.get().getTaskList();
            return taskMapper.mapToTaskDtoList(taskList);
        }
        return new ArrayList<>();
    }

    public void saveTask(TaskCrudDto taskCrudDto){
        String receivedToken = taskCrudDto.getUserToken();
        Optional<User> userOptional = getUserWithActiveSessionToken(receivedToken);
        if(userOptional.isPresent()){
            executeTaskSaveUpdate(userOptional.get(), taskCrudDto);
        }
    }

    private void executeTaskSaveUpdate(User user, TaskCrudDto taskCrudDto){
        Optional<Task> task = findTask(taskCrudDto, taskCrudDto.getFrontId(), user);
        if(task.isPresent()){

        }
    }

    private Optional<Task> findTask(TaskCrudDto updateDto, int frontId, User user){
        List<Task> taskList = user.getTaskList();
        for(int i=0; i<taskList.size(); i++){
            if(taskList.get(i).getFrontId()==frontId){
                return Optional.of(taskList.get(i));
            }
        }
        return Optional.empty();
    }

    private Optional<User> getUserWithActiveSessionToken(String receivedToken){

        userService.
/*

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

 */
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
