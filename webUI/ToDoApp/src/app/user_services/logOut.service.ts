import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { catchError } from "rxjs/operators"
import { AppState } from "../AppState"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { addServerMessage, createMultipleCards, setToken, setUserLoggedToFalse } from "../store-actions"
import { StringDto } from "../StringDto"
import { TokenService } from "./token.service"

@Injectable({
    providedIn: 'root'
})
export class LogOutService {
    token:string = ""
    userLogged:boolean = false

    appState$:Observable<any>

    constructor(private store: Store<{appState:AppState}>,
      private http:HttpClient,
      private serviceSettings:ServicesSettingsAndTools,
      private tokenService:TokenService) {
        this.appState$ = store.select('appState')
        this.appState$.subscribe(app => this.setState(app))
    }

    private setState(state:AppState):void {
        this.token = state.token
        this.userLogged = this.userLogged
    }

    logoutUser():void {
      this.addMessage("Logging out user...",true,0)
      if(this.serviceSettings.tokenReceived()){
        this.http.get<StringDto>(this.serviceSettings.logOutUrl + this.token, {observe:'response'})
        .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
        .subscribe(
          response => {
            this.analyzeLogoutResponse(response)
          }
        )
      } else {
        var message = 'Token not found.'
        this.addMessage(this.serviceSettings.tokenNotFoundMessage,false,0)
      }
    }
    
    private analyzeLogoutResponse(response:any):void {
      if(response != null){
        var status = response.status
        if(response.body != null){
          var message:string = response.body.value
          if(status==202){
            this.executeLogOutOperations(message, status)
          }
        }
      }
    }

    private executeLogOutOperations(message:string, status:number){
      console.log("starting log out operations execution")
      this.addMessage(message,true,status)
      this.store.dispatch(setUserLoggedToFalse())
      this.store.dispatch(setToken({token:""}))
      this.store.dispatch(createMultipleCards({cards:[]}))
      this.tokenService.getToken()
    }

    private addMessage(message:string, status:boolean, statusCode:number){
      this.serviceSettings.addServerManagementMessage(message, status, statusCode)
    }
}