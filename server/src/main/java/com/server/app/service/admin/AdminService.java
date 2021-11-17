package com.server.app.service.admin;

import com.server.app.domain.AppSession;
import com.server.app.domain.AppUser;
import com.server.app.domain.Task;
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
        Iterable<AppUser> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        for(AppUser appUser : users){
            userDtos.add(mapToUserDto(appUser));
        }
        return userDtos;
    }

    public List<UserDto> getUsersFirstActiveNoLaterThan(int daysFrom){
        Iterable<AppUser> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        for(AppUser appUser : users){
            UserDto userDto = mapToUserDto(appUser);
            if(isUserFirstActiveNoLaterThan(daysFrom, userDto)) {
                userDtos.add(userDto);
            }
        }
        return userDtos;
    }

    private UserDto mapToUserDto(AppUser appUser){
        Optional<LocalDateTime> firstActive = getFirstActive(appUser);
        Optional<LocalDateTime> lastActive = getLastActive(appUser);
        return new UserDto(
                appUser.getId(),
                firstActive,
                lastActive,
                appUser.getTypeOfUser().toString(),
                appUser.getUserEmail(),
                appUser.getPassword(),
                appUser.getTaskList().size());
    }

    private Optional<LocalDateTime> getFirstActive(AppUser appUser){
        List<AppSession> appSessions = appUser.getAppSessionList();
        if(appSessions.size()>0){
            return Optional.of(appSessions.get(0).getSessionOpen());
        } else {
            return Optional.empty();
        }
    }

    private Optional<LocalDateTime> getLastActive(AppUser appUser){
        List<AppSession> appSessions = appUser.getAppSessionList();
        if(appSessions.size()>0) {
            AppSession appSession = appSessions.get(appSessions.size() - 1);
            if (appSession.getSessionClosed() != null) {
                return Optional.of(appSession.getSessionClosed());
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
        Optional<AppUser> userOptional = userRepository.findById(id);
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
