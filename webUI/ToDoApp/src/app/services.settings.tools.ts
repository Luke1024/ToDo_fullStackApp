import { HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "./store/AppState"
import { Card } from "./models/card"
import { ServerMessage } from "./models/server-message"
import { addServerMessage } from "./store/store-actions"
import { StringDto } from "./models/string-dto"
import { Task } from "./models/task"

@Injectable({
  providedIn: 'root'
})
export class ServicesSettingsAndTools {
    rootUrl = 'http://localhost:8080/toDo'
    tokenUrl = this.rootUrl + '/token'
    loginUrl = this.rootUrl + '/login'
    registerUrl = this.rootUrl + '/register/'
    tasksUrl = this.rootUrl + '/tasks/'
    tasksDoneUrl = this.rootUrl + '/tasks/done/'
    tasksTodoUrl = this.rootUrl + '/tasks/todo/'
    logOutUrl = this.rootUrl + '/logout/'
    acceptedTokenLength = 15

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }

    token:string = ""
    userLogged:boolean = false

    tokenNotFoundMessage = "Cannot connect to server."

    appState$:Observable<any>

    constructor(private store: Store<{appState:AppState}>) {
      this.appState$ = store.select('appState')
      this.appState$.subscribe(app => this.setState(app))
    }

    private setState(state:AppState):void {
      this.token = state.token
      this.userLogged = this.userLogged
  }

    addServerManagementMessage(message:string, status:boolean, statusCode:number){
      var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
      this.store.dispatch(addServerMessage({message:serverMessage}))
    }

    cardToTaskConverter(card:Card):Task {
      var task:Task = {id:card.id,name:card.taskName, description:card.description, done:card.done}
      return task
    }

    taskToCardConverter(task:Task):Card {
      var card:Card = {id:task.id, taskName:task.name, description:task.description, done:task.done,
        message:"",messageShow:false, editMode:true, folded:false}
      return card
    }

    taskListToCardConverter(tasks:Task[]):Card[] {
      var cards:Card[] = []
      for(var i=0; i<tasks.length; i++) {
        var card:Card = {
          id:tasks[i].id,
          taskName:tasks[i].name,
          description:tasks[i].description,
          done:tasks[i].done,
          message:"",
          messageShow:false,
          editMode:false,
          folded:true}
          
          cards.push(card)
      }
      return cards
    }
    
    handleHttpError(error: HttpErrorResponse) {
      return new Observable(observer => {
        if (error.error instanceof ErrorEvent) {
          //general error
          this.addServerManagementMessage(error.error.message,false,error.status);
        } else {
          //backend error
          var errorValue:string = error.error.value
          var errorStatus:number = error.status
          this.addServerManagementMessage(errorValue,false ,errorStatus)
        }
        observer.next(null)
    })
  }

  convertTasks(tasks:Task[]){
    return this.taskListToCardConverter(tasks)
  }

  tokenReceived(): boolean {
    if(this.token != null){
      if(this.token.length==this.acceptedTokenLength) {
        return true
      }      
    }
    return false
  }

  checkTokenLength(token:string): boolean {
    if(token != null){
      if(token.length == this.acceptedTokenLength) {
        return true
      }      
    }
    return false
  }
}