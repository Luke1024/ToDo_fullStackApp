import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "../AppState";
import { ServerMessage } from "../server-message";
import { addServerManagementMessage, setToken } from "../store-actions";
import { StringDto } from "../StringDto";
import { UserServiceService } from "../user-service.service";
import { UserServiceSettings } from "./user.service.settings";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    userServiceSettings:UserServiceSettings = new UserServiceSettings

    token:string = ""

    appState$:Observable<any>

    constructor(private http:HttpClient, private store:Store<{appState:AppState}>) {
        this.appState$ = store.select('appState')
        this.appState$.subscribe(app => this.token = app.token)
        this.getToken()
    }

    private getToken(): void {
        this.addServerManagementMessage("Connecting to server...", true, 0)
        this.http.get<StringDto>(this.userServiceSettings.tokenUrl, {observe:'response'}).subscribe(token => this.setToken(token))
        //.pipe(catchError(this.handleError<HttpResponse>()))
    }

    private setToken(response:HttpResponse<StringDto>):void {
        var status:number = response.status
    
        if(status==200){
          if(response.body?.value != null){
            if(this.checkTokenLength(response.body.value)){
              console.log('Token received: ' + this.token)
              this.addServerManagementMessage("Connected", true,0)
              this.store.dispatch(setToken({token:response.body.value}))
              return
            }
          }
        }
        this.addServerManagementMessage("Server not responding.",false,0)
      }
    
      private checkTokenLength(token:string):boolean {
        if(token!=null){
          if(token.length==this.userServiceSettings.acceptedTokenLength) {
            return true
          }
        }
        return false
      }

    private addServerManagementMessage(message:string, status:boolean, statusCode:number){
        var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
        this.store.dispatch(addServerManagementMessage({message:serverMessage}))
      }
}