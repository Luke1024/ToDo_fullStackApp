import { Injectable } from '@angular/core';
import { Task } from './Task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  private rootUrl = 'http://localhost:8080/toDo'
  private tokenUrl = '/token'
  private tasksUrl = '/tasks/'
  private token:String
  private tokenLoaded = false

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private http:HttpClient) {}

  

  loadToken(token:String){
    this.token = token
    this.tokenLoaded = true
    
  }

  getTasks(): Observable<Task[]> {
    if(this.tokenLoaded){
      return this.http.get<Task[]>(this.rootUrl + this.tasksUrl)
      .pipe(catchError(this.handleError<Task[]>('getTasks', [])))
    } else {
      this.getToken()
    }
  }

  getToken():void {
    this.http.get<String>(this.rootUrl + this.tokenUrl)
    .pipe(catchError(this.handleError<String>('getToken', '')))
    .subscribe(token => this.loadToken(token))
  }

  save() {}





  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
