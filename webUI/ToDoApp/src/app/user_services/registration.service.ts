import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { catchError } from "rxjs/operators"
import { AppState } from "../AppState"
import { ServerMessage } from "../server-message"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { addServerMessage, setFormPanelMessage, setTopBarMessage } from "../store-actions"
import { StringDto } from "../StringDto"
import { UserCredentials } from "../UserCredentials"

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    
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

    registerUser(userCredentials: UserCredentials):void {
      this.addMessage("Registering user...",true,0)
        if(this.serviceSettings.tokenReceived()){
          if(!userCredentials.userEmail || !userCredentials.userPassword){
            var message = 'Email and password can\'t be blank.'
            this.store.dispatch(setFormPanelMessage({message}))
            this.addMessage(message,false,0)
          }else{
            this.http.post<StringDto>(
              this.serviceSettings.registerUrl + this.token, userCredentials, {observe: 'response'})
              .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
              .subscribe(
              response => { 
                this.analyzeRegisterResponse(response)
              }
            )
          }
        } else {
          this.addMessage(this.serviceSettings.tokenNotFoundMessage,false,0)
        }
      }
    
      private analyzeRegisterResponse(response:any):void {
        if(response != null){
          var status = response.status
          if(response.body != null){
            var message:string = response.body.value
            if(status==202){
              this.store.dispatch(setFormPanelMessage({message}))
              this.addMessage(message,true,status)
            } else {
              this.store.dispatch(setFormPanelMessage({message}))
            }
          }
        }
      }

    private addMessage(message:string, status:boolean, statusCode:number){
        this.serviceSettings.addServerManagementMessage(message, status, statusCode)
    }
}