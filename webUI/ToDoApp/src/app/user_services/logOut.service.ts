import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../AppState"
import { ServerMessage } from "../server-message"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { addServerMessage, setUserLoggedToFalse } from "../store-actions"
import { StringDto } from "../StringDto"

@Injectable({
    providedIn: 'root'
})
export class LogOutService {
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

    logoutUser():void {
        this.addServerManagementMessage("Logging out user...",true,0)
        if(this.tokenReceived()){
          this.http.get<StringDto>(this.serviceSettings.loginUrl + this.token, {observe:'response'}).subscribe(
            response => {
              this.analyzeLogoutResponse(response)
            }
          )
        } else {
          var message = 'Token not found.'
          this.addServerManagementMessage(message,false,0)
        }
      }
    
    private analyzeLogoutResponse(response:HttpResponse<StringDto>):void {
      //202
      if(response != null){
        var status = response.status
        if(response.body != null){
          var message:string = response.body.value
          if(status==202){
            this.addServerManagementMessage(message,true,status)
            this.store.dispatch(setUserLoggedToFalse())
          }else{
            this.addServerManagementMessage(message,false,10)
          }
        }
      }
      this.addServerManagementMessage("There is a problem with logging out user.",false,5)
    }

    private addServerManagementMessage(message:string, status:boolean, statusCode:number){
      var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
      this.store.dispatch(addServerMessage({message:serverMessage}))
    }

    private tokenReceived(): boolean {
      return this.token.length==this.serviceSettings.acceptedTokenLength
    }
}