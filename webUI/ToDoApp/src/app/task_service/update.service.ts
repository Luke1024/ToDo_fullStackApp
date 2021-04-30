import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { catchError } from "rxjs/operators"
import { AppState } from "../AppState"
import { Card } from "../Card"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { updateCard } from "../store-actions"
import { StringDto } from "../StringDto"
import { Task } from "../Task"

@Injectable({
    providedIn: 'root'
})
export class UpdateService {

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

    updateTask(card: Card): void {
      console.log(card)
      if(this.serviceSettings.tokenReceived()){
        this.http.put<StringDto>(this.serviceSettings.tasksUrl + this.token, 
          this.serviceSettings.cardToTaskConverter(card), {observe:'response'})
          .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
          .subscribe(response => this.analyzeUpdateResponse(card,response))
      } else {
        this.addMessage(this.serviceSettings.tokenNotFoundMessage,false,0)
      }
    }

    private analyzeUpdateResponse(card:Card, response:any):void {
      if(response != null){
        var status = response.status
        if(response.body != null){  
          if(status==202){
            this.store.dispatch(updateCard({card}))
            if(response.body != null && response.status != null){
              this.addMessage(response.body.value, false, response.status)
            }
          }
        }
      }
    }

    private addMessage(message:string, messageStatus:boolean, messageStatusCode:number):void {
      this.serviceSettings.addServerManagementMessage(message, messageStatus, messageStatusCode)
    }
}