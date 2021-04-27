import { HttpHeaders, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { AppState } from "./AppState"
import { Card } from "./Card"
import { ServerMessage } from "./server-message"
import { addServerMessage } from "./store-actions"
import { StringDto } from "./StringDto"
import { Task } from "./Task"

@Injectable({
  providedIn: 'root'
})
export class ServicesSettingsAndTools {
    rootUrl = 'http://localhost:8080/toDo'
    tokenUrl = this.rootUrl + '/token'
    loginUrl = this.rootUrl + '/login'
    registerUrl = this.rootUrl + '/register'
    tasksUrl = this.rootUrl + '/tasks/'
    acceptedTokenLength = 15

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }

    addServerManagementMessage(message:string, status:boolean, statusCode:number, store:Store){
      var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
      store.dispatch(addServerMessage({message:serverMessage}))
    }

    cardToTaskConverter(card:Card):Task {
      var task:Task = {frontId:card.frontId,taskName:card.taskName, description:card.description, done:card.done}
      return task
    }
}