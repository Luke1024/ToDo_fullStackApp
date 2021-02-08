import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StringDto } from './StringDto';
import { Task } from './Task';
import { TaskServiceService } from './task-service.service';
import { UserServiceService } from './user-service.service';
import { UserCredentials } from './UserCredentials';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private taskService:TaskServiceService, private userService:UserServiceService) { }

  getToken(): Observable<StringDto> {
    return this.userService.getToken()
  }

  loginUser(token:string, userCredentials:UserCredentials): Observable<StringDto> {
    return this.userService.login(token, userCredentials)
  }

  registerUser(token:string, userCredentials:UserCredentials): Observable<StringDto> {
    return this.userService.register(token, userCredentials)
  }

  logoutUser(token:string): Observable<StringDto> {
    return this.userService.logout(token)
  }

  getTasks(token:string):Observable<Task[]> {
    return this.taskService.getTasks(token)
  }

  saveTask(token:string, task:Task): Observable<StringDto> {
    return this.taskService.saveTask(token, task)
  }

  updateTask(token:string, task:Task): Observable<StringDto> {
    return this.taskService.updateTask(token, task)
  }
  
  deleteTask(token:string, task:Task): Observable<StringDto> {
    return this.taskService.deleteTask(token, task)
  }
}
