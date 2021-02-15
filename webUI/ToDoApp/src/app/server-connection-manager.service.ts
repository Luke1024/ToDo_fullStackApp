import { HttpResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { Response } from './Response';
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

  getAcceptedTokenLength():number {
    return this.acceptedTokenLength
  }

  private setToken(response:HttpResponse<StringDto>):boolean {
    var status:number = response.status

    if(status==200){
      if(response.body?.value != null){
        if(this.checkTokenLength(response.body.value)){
          this.token = response.body.value
          console.log('Token received: ' + this.token)
          this.tokenReceived = true
          return true
        }
      }
    }
    return false
  }

  private checkTokenLength(token:string):boolean {
    if(token!=null){
      if(token.length==this.acceptedTokenLength) {
        return true
      }
    }
    return false
  }


  loginUser(userCredentials: UserCredentials):Observable<Response> {
    return new Observable(observer => {
      if(this.tokenReceived){
        if(!userCredentials.userEmail || !userCredentials.userPassword){
          var message = 'Email and password can\'t be blank.'
          console.log(message)
          observer.next(new Response(false,0,message))
        }else{
          this.userService.login(this.token, userCredentials).subscribe(
            response => { 
              observer.next(this.analyzeLoginResponse(response, userCredentials))
            }
          )
        }
      } else {
        var message = 'Token not found.'
        observer.next(new Response(false,0,message))
      }
    })
  }

  private analyzeLoginResponse(response:HttpResponse<StringDto>, userCredentials:UserCredentials):Response{
    if(response != null){
      var status = response.status
      if(response.body != null){  
        var message:string = response.body.value
        if(status==202){
          if(this.checkTokenLength(message)){
            this.updateUserStatusToLogin(userCredentials, message)
            return new Response(true, status, "User logged in.")
          }
        }
      }
    }
    return new Response(false, 0, "There is a problem with a server response.")
  }

  private updateUserStatusToLogin(userCredentials:UserCredentials, token:string){
    this.token = token
    this.userLogged = true
    this.userEmail = userCredentials.userEmail
  }

  registerUser(userCredentials: UserCredentials):Observable<Response> {
    return new Observable(observer => {
      if(this.tokenReceived){
        if(!userCredentials.userEmail || !userCredentials.userPassword){
          var message = 'Email and password can\'t be blank.'
          observer.next(new Response(false,0,message))
        }else{
          this.userService.register(this.token, userCredentials).subscribe(
            response => { 
              observer.next(this.analyzeRegisterResponse(response))
            }
          )
        }
      } else {
        var message = 'Token not found.'
        observer.next(new Response(false,0,message))
      }
    })
  }

  private analyzeRegisterResponse(response:HttpResponse<StringDto>):Response {
    if(response != null){
      var status = response.status
      if(response.body != null){
        var message:string = response.body.value
        if(status==202){
          return new Response(true,status,message)
        }
      }
    }
    return new Response(false, 0, "There is a problem with a server response.")
  }

  logoutUser():Observable<Response> {
    return new Observable(observer => {
      if(this.tokenReceived){
        this.userService.logout(this.token).subscribe(
          response => {
            observer.next(this.analyzeLogoutResponse(response))
          }
        )
      } else {
        var message = 'Token not found.'
        observer.next(new Response(false,0,message))
      }
    })
  }

  private analyzeLogoutResponse(response:HttpResponse<StringDto>):Response {

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



