import { Injectable } from '@angular/core';
import { Task } from './Task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StringDto } from './StringDto';
 
@Injectable({providedIn: 'root' })
export class TaskServiceService {

  private rootUrl = 'http://localhost:8080/toDo'
  private tokenUrl = this.rootUrl + '/token'
  private tasksUrl = this.rootUrl + '/tasks/'
  private tokenLoaded = false

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private http:HttpClient) {}

  getTasks(token:string): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl + token)
      .pipe(catchError(this.handleError<Task[]>('getTasks', [])))
  }

  saveTask(token:string,task: Task): Observable<StringDto> {
    console.log('saving in service called')
    console.log(this.tasksUrl + token)
    return this.http.post<StringDto>(this.tasksUrl + token, task, this.httpOptions)
    .pipe(catchError(this.handleErrorWithStringMessage<StringDto>('addTask')))
  }

  updateTask(token:string,task: Task): Observable<StringDto> {
    return this.http.put<StringDto>(this.tasksUrl + token, task, this.httpOptions)
    .pipe(catchError(this.handleErrorWithStringMessage<StringDto>('updateTask')))
  }

  deleteTask(token:string,task: Task | number): Observable<StringDto> {
    const id = typeof task === 'number' ? task : task.frontId;
    const url = `${this.tasksUrl + token}/${id}`

    return this.http.delete<StringDto>(url, this.httpOptions).pipe(
      catchError(this.handleErrorWithStringMessage<StringDto>('deleteTask'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handleErrorWithStringMessage<StringDto>(operation = 'operation') {
    return (error: StringDto): Observable<StringDto> => {
      var message = { value: "someString" }

      message.value = "${operation} failed: ${error.message}"
      return of(message as unknown as StringDto)
    }
  }
}
