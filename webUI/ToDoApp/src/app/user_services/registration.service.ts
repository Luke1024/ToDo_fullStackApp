import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../AppState"
import { ServerMessage } from "../server-message"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { addServerMessage, setTopBarMessage } from "../store-actions"
import { StringDto } from "../StringDto"
import { UserCredentials } from "../UserCredentials"

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    
    token:string = ""
    userLogged:boolean = false

    serviceSettings:ServicesSettingsAndTools = new ServicesSettingsAndTools()

    appState$:Observable<any>

    constructor(private store: Store<{appState:AppState}>,
      private http:HttpClient) {
        this.appState$ = store.select('appState')
        this.appState$.subscribe(app => this.setState(app))
    }

    private setState(state:AppState):void {
        this.token = state.token
        this.userLogged = this.userLogged
    }

    registerUser(userCredentials: UserCredentials):void {
      this.addServerManagementMessage("Registering user...",true,0)
        if(this.tokenReceived()){
          if(!userCredentials.userEmail || !userCredentials.userPassword){
            var message = 'Email and password can\'t be blank.'
            this.store.dispatch(setTopBarMessage({message}))
            this.addServerManagementMessage(message,false,4)
          }else{
            this.http.post<StringDto>(
              this.serviceSettings.registerUrl + this.token, userCredentials, {observe: 'response'}).subscribe(
              response => { 
                this.analyzeRegisterResponse(response)
              }
            )
          }
        } else {
          var message = 'Token not found.'
          this.addServerManagementMessage(message,false,0)
        }
      }

      private tokenReceived(): boolean {
        return this.token.length==this.serviceSettings.acceptedTokenLength
      }
    
      private analyzeRegisterResponse(response:HttpResponse<StringDto>):void {
        if(response != null){
          var status = response.status
          if(response.body != null){
            var message:string = response.body.value
            if(status==202){
              this.addServerManagementMessage(message,true,status)
            }else{
              this.addServerManagementMessage(message,false,status)
            }
          }
        }
        this.addServerManagementMessage("There is a problem with registering user.", false, response.status!)
    }

    private addServerManagementMessage(message:string, status:boolean, statusCode:number){
        var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
        this.store.dispatch(addServerMessage({message:serverMessage}))
    }
}