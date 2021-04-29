import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppState } from "../AppState";
import { ServerMessage } from "../server-message";
import { ServicesSettingsAndTools } from "../services.settings.tools";
import { addServerMessage, setToken } from "../store-actions";
import { StringDto } from "../StringDto";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    token:string = ""

    appState$:Observable<any>

    constructor(private http:HttpClient,
       private store:Store<{appState:AppState}>,
       private serviceSettings:ServicesSettingsAndTools) {
        this.appState$ = store.select('appState')
        this.appState$.subscribe(app => this.token = app.token)
    }

    getToken(): void {
        this.addServerManagementMessage("Connecting to server...", true, 0)
        this.http.get<StringDto>(this.serviceSettings.tokenUrl, {observe:'response'})
        .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
        .subscribe(token => this.setToken(token))
    }

    private setToken(response:any):void {
      if(response != null){
        var status = response.status
        if(response.body != null){
          if(status==200){
            if(response.body?.value != null){
              if(this.serviceSettings.checkTokenLength(response.body.value)){
                console.log('Token received: ' + this.token)
                this.addServerManagementMessage("Connected", true,0)
                this.store.dispatch(setToken({token:response.body.value}))
                return
              }
          }
        }
      }
    }
  }

    private addServerManagementMessage(message:string, status:boolean, statusCode:number){
        var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
        this.store.dispatch(addServerMessage({message:serverMessage}))
      }
}