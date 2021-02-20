import { HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
  
  //user status
  private userLogged = false
  private userEmail = ''

  //messages
  private userPanelMessagesSource = new Subject<string>()
  private userPanelMessageVisiblitySwitchSource = new Subject<boolean>()
  private userPanelMessageStatusSource = new Subject<boolean>()
  private userLogInFlagSource = new Subject<boolean>()

  private cardMessagesSource = new Subject<string>()
  private cardMessageVisibilitySwitchSource = new Subject<boolean>()
  private cardMessageStatusSource = new Subject<boolean>()

  private taskPipelineSource = new Subject<Task[]>()
  //private taskCrudDtoSource = new Subject<TaskCrudDto>()
  

  constructor(private taskService:TaskServiceService, private userService:UserServiceService) {}

  userPanelMessage$ = this.userPanelMessagesSource.asObservable()
  userPanelMessageVisibilitySwitch$ = this.userPanelMessageVisiblitySwitchSource.asObservable()
  userPanelMessageStatus$ = this.userPanelMessageStatusSource.asObservable()

  userLogInFlag$ = this.userLogInFlagSource.asObservable()

  cardMessage$ = this.cardMessagesSource.asObservable()
  cardMessageVisibilitySwitch$ = this.cardMessageVisibilitySwitchSource.asObservable()
  cardMessageStatus$ = this.cardMessageStatusSource.asObservable()

  taskPipeline$ = this.taskPipelineSource.asObservable()
  //taskCrudDtoPipe$ = this.taskCrudDtoSource.asObservable()
  

  ngOnIInit():void {
    this.getToken()
  }

  userPanelMessage(message:string):void {
    this.userPanelMessagesSource.next(message)
  }

  messageVisibility(visible:boolean):void{
    this.userPanelMessageVisiblitySwitchSource.next(visible)
  }

  messageStatus(status:boolean):void{
    this.userLogInFlagSource.next(status)
  }

  cardMessage(message:string):void {
    this.cardMessagesSource.next(message)
  }

  cardMessageVisibility(visible:boolean):void {
    this.cardMessageVisibilitySwitchSource.next(visible)
  }

  cardMessageStatus(status:boolean):void {
    this.cardMessageStatusSource.next(status)
  }

  //messageSendingFunctions
  //if timemout 0 set to infinite
  sendUserPanelMessage(message:string,status:boolean, timeoutS:number){
    this.messageVisibility(true)
    this.userPanelMessage(message)
    this.messageStatus(true)
    if(timeoutS!=0){
      setTimeout(()=> {
        this.messageVisibility(false)
      },timeoutS*1000)
    }
  }

  sendCardMessage(message:string,status:boolean,timeoutS:number){
    this.cardMessageVisibility(true)
    this.cardMessage(message)
    this.cardMessageStatus(status)
    if(timeoutS==0){
      setTimeout(()=>{
        this.cardMessageVisibility(false)
      },timeoutS*1000)
    }
  }

  setUserLoggedInFlag(flag:boolean){
    this.userLogInFlagSource.next(flag)
  }
  sendTasks(tasks:Task[]):void {
    this.taskPipelineSource.next(tasks)
  }



  getToken():void {
    this.sendUserPanelMessage("Connecting to server...",true,0)
    this.userService.getToken().subscribe(token => this.setToken(token))
  }

  istokenReceived():boolean {
    return this.tokenReceived
  } 

  getAcceptedTokenLength():number {
    return this.acceptedTokenLength
  }

  private setToken(response:HttpResponse<StringDto>):void {
    var status:number = response.status

    if(status==200){
      if(response.body?.value != null){
        if(this.checkTokenLength(response.body.value)){
          this.token = response.body.value
          console.log('Token received: ' + this.token)
          this.sendUserPanelMessage("Connected.",true,4)
          this.tokenReceived = true
        }
      }
    }
    return this.sendUserPanelMessage("Server not responding.",false,0)
  }

  private checkTokenLength(token:string):boolean {
    if(token!=null){
      if(token.length==this.acceptedTokenLength) {
        return true
      }
    }
    return false
  }

  
  //user logging

  loginUser(userCredentials: UserCredentials):void {
    if(this.tokenReceived){
      if(!userCredentials.userEmail || !userCredentials.userPassword){
        var message = 'Email and password can\'t be blank.'
        this.sendUserPanelMessage(message,false,0)
      }else{
        this.userService.login(this.token, userCredentials).subscribe(
        response => { 
        this.analyzeLoginResponse(response, userCredentials)
        this.checkIfReloadTasks(response)
        })
      }
    } else {
      var message = 'Token not found.'
      this.sendUserPanelMessage(message,false,0)
    }
  }

  private analyzeLoginResponse(response:HttpResponse<StringDto>, userCredentials:UserCredentials):void {
    if(response != null){
      var status = response.status
      if(response.body != null){  
        var message:string = response.body.value
        if(status==202){
          if(this.checkTokenLength(message)){
            this.updateUserStatusToLogin(userCredentials, message)
            this.setUserLoggedInFlag(true)
            this.sendUserPanelMessage("User logged in.",true,4)
          }
        }
      }
    }
    this.sendUserPanelMessage("There is a problem with a server response.",false,0)
  }

  private checkIfReloadTasks(response:HttpResponse<StringDto>):void {
    if(response != null)
      if(response.status){
        this.taskService.getTasks(this.token).subscribe(response => this.analyzeGetTasksResponse(response))
      }else{
        this.sendUserPanelMessage("Cannot get user tasks.",false,0)
      }
    }

  private analyzeGetTasksResponse(response:HttpResponse<Task[]>):void{
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==200){
          this.sendTasks(response.body)
          this.sendUserPanelMessage("Tasks reloaded",true,4)
        }
      }
    }
    this.sendUserPanelMessage("There is problem with reloading tasks.",false,0)
  }

  private updateUserStatusToLogin(userCredentials:UserCredentials, token:string){
    this.token = token
    this.userLogged = true
    this.userEmail = userCredentials.userEmail
  }


  //user registration
  registerUser(userCredentials: UserCredentials):void {
    this.sendUserPanelMessage("Registering user...",true,0)
    if(this.tokenReceived){
      if(!userCredentials.userEmail || !userCredentials.userPassword){
        var message = 'Email and password can\'t be blank.'
        this.sendUserPanelMessage(message,false,4)
      }else{
        this.userService.register(this.token, userCredentials).subscribe(
          response => { 
            this.analyzeRegisterResponse(response)
          }
        )
      }
    } else {
      var message = 'Token not found.'
      this.sendUserPanelMessage(message,false,0)
    }
  }

  private analyzeRegisterResponse(response:HttpResponse<StringDto>):void {
    if(response != null){
      var status = response.status
      if(response.body != null){
        var message:string = response.body.value
        if(status==202){
          this.sendUserPanelMessage(message,true,4)
        }else{
          this.sendUserPanelMessage(message,false,10)
        }
      }
    }
    this.crudResponseAnalysis(response,"There is a problem with registering user.")
  }

  logoutUser():void {
    this.sendUserPanelMessage("Logging out user...",true,0)
    if(this.tokenReceived){
      this.userService.logout(this.token).subscribe(
        response => {
          this.analyzeLogoutResponse(response)
        }
      )
    } else {
      var message = 'Token not found.'
      this.sendUserPanelMessage(message,false,0)
    }
  }

  private analyzeLogoutResponse(response:HttpResponse<StringDto>):void {
    //202
    if(response != null){
      var status = response.status
      if(response.body != null){
        var message:string = response.body.value
        if(status==202){
          this.updateUserStatusToLogout()
          this.sendUserPanelMessage(message,true,4)
          this.setUserLoggedInFlag(false)
        }else{
          this.sendUserPanelMessage(message,false,10)
        }
      }
    }
    this.sendUserPanelMessage("There is a problem with logging out user.",false,5)
  }

  private updateUserStatusToLogout(){
    this.userEmail=''
    this.userLogged=false
  }

  saveTask(task:Task): Observable<Response> {
    console.log('saving task')
    return new Observable(observer => {

    if(this.tokenReceived){
      if(!task.name || !task.description){
        var message = 'Task name and task description can\'t be blank.'
        console.log(message) 
        observer.next(new Response(false,message)); 
      } else {
        this.taskService.saveTask(this.token, task)
        .subscribe(response => { 
          observer.next(this.analyzeSaveTaskResponse(response))
        })
      }
    } else {
      var message = 'Token not found.'
      observer.next(new Response(false,message))
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
        observer.next(new Response(false,message)); 
      } else {
        this.taskService.updateTask(this.token, task)
        .subscribe(response => { 
          observer.next(this.analyzeUpdateResponse(response))
        })
      }
    } else {
      var message = 'Token not found.'
      observer.next(new Response(false,message))
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
  
      
  private crudResponseAnalysis(response:HttpResponse<StringDto>, failMessage:string):Response {
    if(response != null){
      var status = response.status
      if(response.body != null){
        var message:string = response.body.value
        if(status==202){
          
        }else{
          return new Response(false,message)
        }
      }
    }
    return new Response(false,failMessage)
  }
  
}
