import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../AppState"
import { StringDto } from "../StringDto"
import { Task } from "../Task"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { deleteCard } from "../store-actions"
import { Card } from "../Card"

@Injectable({
    providedIn: 'root'
})
export class DeleteService {

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

    deleteTask(card: Card): void {
      const id = card.frontId;
      const url = `${this.serviceSettings.tasksUrl + this.token}/${id}`
      this.http.delete<StringDto>(url, {observe:'response'})
      .subscribe(response => this.analyzeDeleteResponse(card,response))
    }
    
    private analyzeDeleteResponse(card:Card, response:HttpResponse<StringDto>){
      if(response != null){
        if(response.status==202){
          this.store.dispatch(deleteCard({card}))
          if(response.body != null && response.status != null){
            this.serviceSettings.addServerManagementMessage(response.body.value, false, response.status, this.store)
          }
        }
      } else {
        this.serviceSettings.addServerManagementMessage("Response did not received.", false, 0, this.store)
      }
    }
}