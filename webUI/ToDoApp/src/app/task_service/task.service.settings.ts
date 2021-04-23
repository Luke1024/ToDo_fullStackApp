import { HttpHeaders } from "@angular/common/http"

export class TaskServiceSettings {
    rootUrl = 'http://localhost:8080/toDo'
    tokenUrl = this.rootUrl + '/token'
    tasksUrl = this.rootUrl + '/tasks/'
  
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }
}