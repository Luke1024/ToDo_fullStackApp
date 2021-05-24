import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../../store/AppState"
import { StringDto } from "../../models/string-dto"
import { Task } from "../../models/task"
import { ServicesSettingsAndTools } from "../../services.settings.tools"
import { Card } from "../../models/card"
import { createCard } from "../../store/store-actions"
import { catchError } from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})
export class SaveService {

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
//202
    saveTask(card:Card): void {
      if(this.serviceSettings.tokenReceived()){
        this.http.post<StringDto>(this.serviceSettings.tasksUrl + this.token,
           this.serviceSettings.cardToTaskConverter(card), {observe:'response'})
           .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
        .subscribe(response => this.analyzeSaveTaskResponse(card,response))
      } else {
        this.addMessage(this.serviceSettings.tokenNotFoundMessage,false,0)
      }
    }
    
    private analyzeSaveTaskResponse(card:Card,response:any):void {
      if(response != null){
        var status = response.status
        if(response.body != null){
          if(status==200){
            var task:Task= response.body
            var receivedCard:Card = this.serviceSettings.taskToCardConverter(task)
            this.store.dispatch(createCard({card:receivedCard}))
            if(response.body != null && response.status != null){
              this.addMessage(response.body.value, true, response.status)
            }
          }
        }
      }
    }

    private addMessage(message:string, messageStatus:boolean, messageStatusCode:number):void {
      this.serviceSettings.addServerManagementMessage(message, messageStatus, messageStatusCode)
    }
}