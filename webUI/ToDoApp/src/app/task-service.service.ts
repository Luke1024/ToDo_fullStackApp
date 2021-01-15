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
  private tokenUrl = this.rootUrl + '/token'
  private tasksUrl = this.rootUrl + '/tasks/'
  private tokenLoaded = false

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private http:HttpClient) {}

  getToken(): Observable<String> {
    return this.http.get<String>(this.tokenUrl)
    .pipe(catchError(this.handleError<String>('getToken', '')))
  }

  getTasks(token:String): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl + token)
      .pipe(catchError(this.handleError<Task[]>('getTasks', [])))
  }

  saveTask(token:String,task: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl + token, task, this.httpOptions)
    .pipe(catchError(this.handleError<Task>('addTask')))
  }

  updateTask(token:String,task: Task): Observable<any> {
    return this.http.put(this.tasksUrl + token, task, this.httpOptions)
    .pipe(catchError(this.handleError<any>('updateTask')))
  }

  deleteTask(token:String,task: Task | number): Observable<Task> {
    const id = typeof task === 'number' ? task : task.id;
    const url = `${this.tasksUrl + token}/${id}`

    return this.http.delete<Task>(url, this.httpOptions).pipe(
      catchError(this.handleError<Task>('deleteTask'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
