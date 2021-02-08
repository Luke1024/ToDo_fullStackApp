import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from './rest.service';
import { StringDto } from './StringDto';
import { Task } from './Task';
import { UserCredentials } from './UserCredentials';

@Injectable({
  providedIn: 'root'
})
export class ServerConnectionManagerService {

  private token:string = ''
  private tokenReceived = false
  private acceptedTokenLength:number = 15
  message:string = ''
  
  private userLogged = false
  private userEmail = ''

  constructor(private restService:RestService) { }

  ngOnInit(): void {
    this.getToken()
  }

  loginUser(userCredentials: UserCredentials):Observable<string> {
    return new Observable(observer => {
      if(this.tokenReceived){
        if(!userCredentials.userEmail || !userCredentials.userPassword){
          var message = 'Email and password can\'t be blank.'
          console.log(message)
          observer.next(message)
        }else{
          this.restService.loginUser(this.token, userCredentials).subscribe(
            stringDto => { 
              observer.next(stringDto.value)
              this.saveUserState(stringDto.value)
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

  private saveUserState(message:string){
    if(message!=)
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
        this.restService.saveTask(this.token, task)
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
        this.restService.updateTask(this.token, task)
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
      this.restService.deleteTask(this.token,task).subscribe(stringDto => observer.next(stringDto.value))
    })
  }

  private getToken(): void {
    this.restService.getToken().subscribe(token => this.setToken(token))
  }

  private setToken(token:StringDto) {
    this.message = "Connecting to server."
    if(this.checkTokenLength(token)){
      this.tokenReceived = true
      this.token = token.value
      console.log('token received ' + token.value)
      this.message = ''
    }else{
      this.message = "Problem with connecting with the server."
      setTimeout(() => this.getToken(), 5000)
    }
  }

  private checkTokenLength(stringDto:StringDto):boolean {
    if(stringDto!=null){
      if(stringDto.value.length==15) {
        return true
      }
    }
    return false
  }
}
