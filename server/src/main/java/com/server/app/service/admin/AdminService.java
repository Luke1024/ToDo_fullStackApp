package com.server.app.service.admin;

import com.server.app.domain.Session;
import com.server.app.domain.Task;
import com.server.app.domain.User;
import com.server.app.domain.dto.admin.ExtendedTaskDto;
import com.server.app.domain.dto.admin.UserDto;
import com.server.app.repository.SessionRepository;
import com.server.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    public List<UserDto> getUsers(){
        Iterable<User> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        for(User user : users){
            userDtos.add(mapToUserDto(user));
        }
        return userDtos;
    }

    public List<UserDto> getUsersFirstActiveNoLaterThan(int daysFrom){
        Iterable<User> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        for(User user : users){
            UserDto userDto = mapToUserDto(user);
            if(isUserFirstActiveNoLaterThan(daysFrom, userDto)) {
                userDtos.add(userDto);
            }
        }
        return userDtos;
    }

    private UserDto mapToUserDto(User user){
        Optional<LocalDateTime> firstActive = getFirstActive(user);
        Optional<LocalDateTime> lastActive = getLastActive(user);
        return new UserDto(
                user.getId(),
                firstActive,
                lastActive,
                user.getTypeOfUser().toString(),
                user.getUserEmail(),
                user.getPassword(),
                user.getTaskList().size());
    }

    private Optional<LocalDateTime> getFirstActive(User user){
        List<Session> sessions = user.getSessionList();
        if(sessions.size()>0){
            return Optional.of(sessions.get(0).getSessionOpen());
        } else {
            return Optional.empty();
        }
    }

    private Optional<LocalDateTime> getLastActive(User user){
        List<Session> sessions = user.getSessionList();
        if(sessions.size()>0) {
            Session session = sessions.get(sessions.size() - 1);
            if (session.getSessionClosed() != null) {
                return Optional.of(session.getSessionClosed());
            }
        }
        return Optional.empty();
    }

    private boolean isUserFirstActiveNoLaterThan(int daysFrom, UserDto userDto){
        if(userDto.getFirstActive().isPresent()){
            return userDto.getFirstActive().get().isAfter(LocalDateTime.now().minusDays(daysFrom));
        } else {
            return false;
        }
    }

    public List<ExtendedTaskDto> getTasksByUserId(Long id){
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()){
            List<Task> taskList = userOptional.get().getTaskList();
            return mapToExtendedTaskDtoList(taskList);
        } else {
            return new ArrayList<>();
        }
    }

    private List<ExtendedTaskDto> mapToExtendedTaskDtoList(List<Task> tasks){
        return tasks.stream().map(task -> new ExtendedTaskDto(
                task.getId(),
                task.getTaskName(),
                task.getTaskDescription(),
                task.isDone(),
                task.isDeleted()
        )).collect(Collectors.toList());
    }
}
