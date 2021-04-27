import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable, of, throwError } from "rxjs"
import { AppState } from "../AppState"
import { ServerMessage } from "../server-message"
import { addServerMessage, setUserLoggedToTrue } from "../store-actions"
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

  serviceSettings:ServicesSettingsAndTools = new ServicesSettingsAndTools()

  constructor(private store: Store<{appState:AppState}>,
    private http:HttpClient) {
      this.appState$ = store.select('appState')
      this.appState$.subscribe(app => this.setState(app))
  }

  private setState(state:AppState):void {
      this.token = state.token
      this.userLogged = this.userLogged
  }
    
  loginUser(userCredentials: UserCredentials):void {
    if(this.tokenReceived()){
      if(!userCredentials.userEmail || !userCredentials.userPassword){
        var message = 'Email and password can\'t be blank.'
        this.addServerManagementMessage(message,false,0)
      }else{
        this.http.post<StringDto>(
          this.serviceSettings.loginUrl + '/' + this.token, userCredentials, {observe: 'response'}).pipe(
            catchError(this.handleError)
          ).subscribe(
        response => { 
        this.analyzeLoginResponse(response, userCredentials)
        this.checkIfReloadTasks(response)
        })
      }
    } else {
      var message = 'Token not found.'
      this.addServerManagementMessage(message,false,0)
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      var errorValue:string = error.error.value
      var errorStatus:number = error.error.status
      var message:ServerMessage = {message:errorValue, messageStatusCode:errorStatus, messageStatus:false}
      this.store.dispatch(addServerMessage({message}))
      }
      return throwError(
        'Something bad happened; please try again later.');
    }

  private analyzeLoginResponse(response:HttpResponse<StringDto>, userCredentials:UserCredentials):void {
    if(response != null){
      var status = response.status
      if(response.body != null){  
        var message:string = response.body.value
        if(status==202){
          if(this.checkTokenLength(message)){
            this.updateUserStatusToLogin(userCredentials, message)
            this.store.dispatch(setUserLoggedToTrue())
            this.addServerManagementMessage("User logged in.",true,0)
          }
        } else {
          this.addServerManagementMessage(message, false, status)          
        }
      }
    } else {
      this.addServerManagementMessage("There is a problem with a server response.",false,0)
    }
  }

  private checkIfReloadTasks(response:HttpResponse<StringDto>):void {
    if(response != null)
      if(response.status){
        this.http.get<Task[]>(this.serviceSettings.tasksUrl + this.token, {observe:'response'})
        .subscribe(response => this.analyzeGetTasksResponse(response))
      }else{
        this.addServerManagementMessage("Cannot get user tasks.",false,0)
      }
    }

  private analyzeGetTasksResponse(response:HttpResponse<Task[]>):void{
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==200){
         // this.sendTasks(response.body)
          this.addServerManagementMessage("Tasks reloaded",true,4)
        }
      }
    }
    this.addServerManagementMessage("There is problem with reloading tasks.",false,0)
  }

  private updateUserStatusToLogin(userCredentials:UserCredentials, token:string){
    this.token = token
    this.userLogged = true
    //this.userEmail = userCredentials.userEmail
  }

  private addServerManagementMessage(message:string, status:boolean, statusCode:number){
    var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
    this.store.dispatch(addServerMessage({message:serverMessage}))
  }

  private checkTokenLength(token:string):boolean {
    return this.token.length==this.serviceSettings.acceptedTokenLength
  }

  private tokenReceived(): boolean {
    return this.token.length==this.serviceSettings.acceptedTokenLength
  }
}