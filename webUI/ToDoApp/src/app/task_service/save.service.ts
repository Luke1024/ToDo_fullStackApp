import { HttpClient, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../AppState"
import { StringDto } from "../StringDto"
import { Task } from "../Task"
import { ServicesSettingsAndTools } from "../services.settings.tools"
import { Card } from "../Card"
import { createCard } from "../store-actions"

@Injectable({
    providedIn: 'root'
})
export class SaveService {

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
//202
    saveTask(card:Card): void {
      if(this.tokenReceived()){
        this.http.post<StringDto>(this.serviceSettings.tasksUrl + this.token,
           this.serviceSettings.cardToTaskConverter(card), {observe:'response'})
        .subscribe(response => this.analyzeSaveTaskResponse(card,response))
      } else {
        this.serviceSettings.addServerManagementMessage('Token not found.',false,0,this.store)
      }
    }
    
    private analyzeSaveTaskResponse(card:Card,response:HttpResponse<StringDto>):void {
      if(response != null){
        if(response.status==202){
          this.store.dispatch(createCard({card}))
          if(response.body != null && response.status != null){
            this.serviceSettings.addServerManagementMessage(response.body.value, false, response.status, this.store)
          }
        }
      } else {
        this.serviceSettings.addServerManagementMessage("Response did not received.", false, 0, this.store)
      }
    }

    private tokenReceived(): boolean {
      return this.token.length==this.serviceSettings.acceptedTokenLength
    }
}