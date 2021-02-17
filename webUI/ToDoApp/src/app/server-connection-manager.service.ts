import { HttpResponse, HttpResponseBase } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { LoginResponse } from './LoginResponse';
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

  private tasks:Task[] = []
  private taskLoadedFlag = false

  constructor(private taskService:TaskServiceService, private userService:UserServiceService) {}

  getToken():Observable<boolean> {
    return new Observable(observer => {
      this.userService.getToken().subscribe(token => observer.next(this.setToken(token)))
    })
  }

  getTasks():Task[]{
    return this.tasks
  }

  //isTaskLoaded()

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


  loginUser(userCredentials: UserCredentials):Observable<LoginResponse> {
    return new Observable(observer => {
      if(this.tokenReceived){
        if(!userCredentials.userEmail || !userCredentials.userPassword){
          var message = 'Email and password can\'t be blank.'
          console.log(message)
          observer.next(new LoginResponse(false,0,message))
        }else{
          this.userService.login(this.token, userCredentials).subscribe(
            response => { 
              var loginResponse:LoginResponse = this.analyzeLoginResponse(response, userCredentials)
              observer.next(loginResponse)
              this.checkIfReloadTasks(loginResponse).subscribe(response => observer.next(response))
            }
          )
        }
      } else {
        var message = 'Token not found.'
        observer.next(new LoginResponse(false,0,message))
      }
    })
  }

  private analyzeLoginResponse(response:HttpResponse<StringDto>, userCredentials:UserCredentials):LoginResponse {
    if(response != null){
      var status = response.status
      if(response.body != null){  
        var message:string = response.body.value
        if(status==202){
          if(this.checkTokenLength(message)){
            this.updateUserStatusToLogin(userCredentials, message)
            return new LoginResponse(true, status, "User logged in.")
          }
        }
      }
    }
    return new LoginResponse(false, 0, "There is a problem with a server response.")
  }

  private checkIfReloadTasks(response:LoginResponse):Observable<LoginResponse> {
    if(response.status){
      return new Observable(observer => { this.taskService.getTasks(this.token).subscribe(response => observer.next(this.analyzeGetTasksResponse(response)))})
    }else{
      return new Observable(observer => observer.next(new LoginResponse(false,0,"Cannot get tasks.")))
    }
  }

  private analyzeGetTasksResponse(response:HttpResponse<Task[]>):LoginResponse{
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==200){
          return new LoginResponse(true,status,"Tasks reloaded",response)
        }
      }
    }
    return new LoginResponse(false,0,"There is problem with reloading tasks.")
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
    return this.crudResponseAnalysis(response,"There is a problem with registering user.")
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
    //202
    if(response != null){
      var status = response.status
      if(response.body != null){
        var message:string = response.body.value
        if(status==202){
          this.updateUserStatusToLogout()
          return new Response(true,status,message)
        }else{
          return new Response(false,status,message)
        }
      }
    }
    return new Response(false,0,"There is a problem with logging out user.")
  }

  private updateUserStatusToLogout(){
    this.userEmail=''
    this.userLogged=false
  }

  saveTask(task:Task): Observable<Response>{
    console.log('saving task')
    return new Observable(observer => {

    if(this.tokenReceived){
      if(!task.name || !task.description){
        var message = 'Task name and task description can\'t be blank.'
        console.log(message) 
        observer.next(new Response(false,0,message)); 
      } else {
        this.taskService.saveTask(this.token, task)
        .subscribe(response => { 
          observer.next(this.analyzeSaveTaskResponse(response))
        })
      }
    } else {
      var message = 'Token not found.'
      observer.next(new Response(false,0,message))
    }
    })
  }

  private analyzeSaveTaskResponse(response:HttpResponse<StringDto>):Response {
    return this.crudResponseAnalysis(response,"Problem with task saving.")
  }

  updateTask(task: Task): Observable<Response> {
    console.log('updating task')
    return new Observable(observer => {

    if(this.tokenReceived){
      if(!task.name || !task.description){
        var message = 'Task name and task description can\'t be blank.'
        observer.next(new Response(false,0, message)); 
      } else {
        this.taskService.updateTask(this.token, task)
        .subscribe(response => { 
          observer.next(this.analyzeUpdateResponse(response))
        })
      }
    } else {
      var message = 'Token not found.'
      observer.next(new Response(false,0,message))
    }
    })
  }

  private analyzeUpdateResponse(response:HttpResponse<StringDto>){
    return this.crudResponseAnalysis(response,"Problem with task updating.")
  }

  deleteTask(task: Task): Observable<Response> {
    return new Observable(observer => {
      this.taskService.deleteTask(this.token,task).subscribe(response => observer.next(this.analyzeDeleteResponse(response)))
    })
  }

  private analyzeDeleteResponse(response:HttpResponse<StringDto>){
    return this.crudResponseAnalysis(response,"Problem with task deleting.")
  }
      
  private crudResponseAnalysis(response:HttpResponse<StringDto>, failMessage:string):Response{
    if(response != null){
      var status = response.status
      if(response.body != null){
        var message:string = response.body.value
        if(status==202){
          return new Response(true,status,message)
        }else{
          return new Response(false,status,message)
        }
      }
    }
    return new Response(false,0,failMessage)
  }
}
