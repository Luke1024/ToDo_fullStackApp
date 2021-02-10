import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { RestService } from './rest.service';
import { StringDto } from './StringDto';
import { Task } from './Task';
import { TaskServiceService } from './task-service.service';
import { UserServiceService } from './user-service.service';
import { UserCredentials } from './UserCredentials';

@Injectable({
  providedIn: 'root'
})
export class ServerConnectionManagerService {

  private token:string = ''
  private tokenReceived = false
  private acceptedTokenLength:number = 15
  userPanelMessage:string = ''
  
  private userLogged = false
  private userEmail = ''

  constructor(private taskService:TaskServiceService, private userService:UserServiceService) {}

  getToken():Observable<boolean> {
    return new Observable(observer => {
      this.userService.getToken().subscribe(token => observer.next(this.setToken(token)))
    })
  }

  istokenReceived():boolean {
    return this.tokenReceived
  } 

  private setToken(token:StringDto):boolean {
    if(this.checkTokenLength(token.value)){
      this.tokenReceived = true
      this.token = token.value
      console.log('token received ' + token.value)
      return true
    } else {
      return false
    } 
  }

  private checkTokenLength(token:string):boolean {
    if(token!=null){
      if(token.length==this.acceptedTokenLength) {
        return true
      }
    }
    return false
  }


  loginUser(userCredentials: UserCredentials):Observable<string> {
    return new Observable(observer => {
      if(this.tokenReceived){
        if(!userCredentials.userEmail || !userCredentials.userPassword){
          var message = 'Email and password can\'t be blank.'
          console.log(message)
          observer.next(message)
        }else{
          this.userService.login(this.token, userCredentials).subscribe(
            stringDto => { 
              observer.next(stringDto.value)
              this.saveUserState(stringDto.value, userCredentials)
            }
          )
        }
      } else {
        var message = 'Token not found.'
        console.log(message)
        observer.next(message)
      }
    })
  }

  private saveUserState(message:string, userCredentials:UserCredentials){
    if(this.checkTokenLength(message)){
      this.userLogged = true
      this.userEmail = userCredentials.userEmail
    }
  }

  registerUser(userCredentials: UserCredentials):Observable<string> {
    return new Observable(observer => {
      if(this.tokenReceived){
        if(!userCredentials.userEmail || !userCredentials.userPassword){
          var message = 'Email and password can\'t be blank.'
          console.log(message)
          observer.next(message)
        }else{
          this.userService.register(this.token, userCredentials).subscribe(
            stringDto => { 
              observer.next(stringDto.value)
            }
          )
        }
      } else {
        var message = 'Token not found.'
        console.log(message)
        observer.next(message)
      }
    })
  }

  logoutUser():Observable<string> {
    return new Observable(observer => {
      if(this.tokenReceived){
        this.userService.logout(this.token).subscribe(
          stringDto => {
            observer.next(stringDto.value)
          }
        )
      } else {
        var message = 'Token not found.'
        console.log(message)
        observer.next(message)
      }
    })
  }


  saveTask(task:Task): Observable<string>{
    console.log('saving task')
    return new Observable(observer => {

    if(this.tokenReceived){
      if(!task.name || !task.description){
        var message = 'Task name and task description can\'t be blank.'
        console.log(message) 
        observer.next(message); 
      } else {
        this.taskService.saveTask(this.token, task)
        .subscribe(stringDto => { 
          observer.next(stringDto.value)
        })
      }
    } else {
      var message = 'Token not found.'
      console.log(message)
      observer.next(message)
    }
    })
  }

  updateTask(task: Task): Observable<string> {
    console.log('updating task')
    return new Observable(observer => {

    if(this.tokenReceived){
      if(!task.name || !task.description){
        var message = 'Task name and task description can\'t be blank.'
        console.log(message) 
        observer.next(message); 
      } else {
        this.taskService.updateTask(this.token, task)
        .subscribe(stringDto => { 
          observer.next(stringDto.value)
        })
      }
    } else {
      var message = 'Token not found.'
      console.log(message)
      observer.next(message)
    }
    })
  }

  deleteTask(task: Task): Observable<string> {
    console.log('deleting task')
    return new Observable(observer => {
      this.taskService.deleteTask(this.token,task).subscribe(stringDto => observer.next(stringDto.value))
    })
  }
}



