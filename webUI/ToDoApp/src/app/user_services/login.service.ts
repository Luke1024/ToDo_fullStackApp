import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable, of, throwError } from "rxjs"
import { AppState } from "../AppState"
import { addServerMessage, createMultipleCards, setToken, setTopBarMessage, setUserLoggedToTrue } from "../store-actions"
import { StringDto } from "../StringDto"
import { Task } from "../Task"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { UserCredentials } from "../UserCredentials"
import { catchError } from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})
export class LoginService {
  token:string = ""
  userLogged:boolean = false

  appState$:Observable<any>

  constructor(private store: Store<{appState:AppState}>,
    private http:HttpClient,
    private serviceSettings:ServicesSettingsAndTools) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.setState(app))
  }

  private setState(state:AppState):void {
      this.token = state.token
      this.userLogged = this.userLogged
  }
    
  loginUser(userCredentials: UserCredentials):void {
    if(this.serviceSettings.tokenReceived()){
      if(!userCredentials.userEmail || !userCredentials.userPassword){
        this.addMessage('Email and password can\'t be blank.',false,0)
      }else{
        this.http.post<StringDto>(
          this.serviceSettings.loginUrl + '/' + this.token, userCredentials, {observe: 'response'})
          .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
          .subscribe(
            response => { 
              this.analyzeLoginResponse(response, userCredentials)
            })
      }
    } else {
      this.serviceSettings.addServerManagementMessage(this.serviceSettings.tokenNotFoundMessage,false,0)
    }
  }

  private analyzeLoginResponse(response:any, userCredentials:UserCredentials):void {
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==202){
          var token = response.body.value
          if(this.checkTokenLength(token)){
            this.executeLoginOperations(response, userCredentials)
          }
        }      
      }
    }
  }

  private checkTokenLength(token:string):boolean {
    if(token != null){
      return this.token.length==this.serviceSettings.acceptedTokenLength
    } else return false
  }

  private executeLoginOperations(response:HttpResponse<StringDto>, userCredentials:UserCredentials) {
    this.store.dispatch(setTopBarMessage({message:userCredentials.userEmail}))
    this.store.dispatch(setUserLoggedToTrue())
    this.store.dispatch(setToken({token:response.body!.value}))
    this.addMessage("User logged in.",true,0)
    this.reloadTasks(response)
  }

  private reloadTasks(response:any):void {
    this.http.get<Task[]>(this.serviceSettings.tasksUrl + this.token, {observe:'response'})
    .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
    .subscribe(response => this.analyzeGetTasksResponse(response))
  }

  private analyzeGetTasksResponse(response:any):void{
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==200){
          this.store.dispatch(createMultipleCards({cards:this.serviceSettings.convertTasks(response.body)}))
          this.addMessage("Tasks reloaded",true,0)
        }
      }
    }
  }

  private addMessage(message:string, status:boolean, statusCode:number): void {
    this.serviceSettings.addServerManagementMessage(message, status, statusCode)
  }
}