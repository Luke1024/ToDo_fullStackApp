import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable, of, throwError } from "rxjs"
import { AppState } from "../../store/AppState"
import { addServerMessage, createMultipleCards, setFormPanelMode, setToken, setTopBarMessage, setUserLoggedToTrue } from "../../store/store-actions"
import { StringDto } from "../../models/string-dto"
import { Task } from "../../models/task"
import { ServicesSettingsAndTools } from "../../services.settings.tools"
import { UserCredentials } from "../../models/user-credentials"
import { catchError } from "rxjs/operators"
import { FormPanelMode } from "../../models/form-panel-mode"

@Injectable({
    providedIn: 'root'
})
export class LoginService {
  private token:string = ""
  private userLogged:boolean = false

  private appState$:Observable<any>

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
        this.switchOffFormPanel()
        this.communicateWithServer(userCredentials);
      }
    } else {
      this.serviceSettings.addServerManagementMessage(this.serviceSettings.tokenNotFoundMessage,false,0)
    }
  }

  private switchOffFormPanel(){
    this.store.dispatch(setFormPanelMode({mode:FormPanelMode.NOT_VISIBLE}))
  }

  private communicateWithServer(userCredentials:UserCredentials){
    this.http.post<StringDto>(
      this.serviceSettings.loginUrl + '/' + this.token, userCredentials, {observe: 'response'})
      .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
      .subscribe(
        response => { 
          this.analyzeLoginResponse(response, userCredentials)
        })
  }

  private analyzeLoginResponse(response:any, userCredentials:UserCredentials):void {
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==202){
          var message = response.body.value
          this.executeLoginOperations(message, userCredentials)
        }      
      }
    }
  }

  private executeLoginOperations(message: string, userCredentials:UserCredentials) {
    var topBarMessage = "Logged as " + userCredentials.userEmail
    this.store.dispatch(setTopBarMessage({message: topBarMessage}))
    this.store.dispatch(setUserLoggedToTrue())
    this.addMessage("User logged in.",true,0)
    this.reloadTasks()
  }

  private reloadTasks():void {
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