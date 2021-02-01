import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private rootUrl = 'http://localhost:8080/toDo'
  private tokenUrl = this.rootUrl + '/token'
  private tasksUrl = this.rootUrl + '/tasks/'
  private tokenLoaded = false

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private http:HttpClient) {}
}
