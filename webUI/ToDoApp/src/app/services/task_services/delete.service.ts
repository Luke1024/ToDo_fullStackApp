import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../../store/AppState"
import { StringDto } from "../../models/string-dto"
import { Task } from "../../models/task"
import { ServicesSettingsAndTools } from "../../services.settings.tools"
import { deleteCard } from "../../store/store-actions"
import { Card } from "../../models/card"
import { catchError } from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})
export class DeleteService {

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

    deleteTask(card: Card): void {
      if(this.serviceSettings.tokenReceived()){
        const id = card.id;
        const url = `${this.serviceSettings.tasksUrl + this.token}/${id}`
        this.http.delete<StringDto>(url, {observe:'response'})
        .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
        .subscribe(response => this.analyzeDeleteResponse(card,response))
      }
    }
    
    private analyzeDeleteResponse(card:Card, response:any){
      if(response != null){
        var status = response.status
        if(response.body != null){
          if(status==202){
            this.store.dispatch(deleteCard({card}))
            this.addMessage(response.body.value, true, response.status)
          }
        }
      }
    }

    private addMessage(message:string, messageStatus:boolean, messageStatusCode:number):void {
      this.serviceSettings.addServerManagementMessage(message, messageStatus, messageStatusCode)
    }
}