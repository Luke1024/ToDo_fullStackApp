import { Injectable } from '@angular/core';
import { Task } from './Task';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  getTasks(token:string): Observable<HttpResponse<Task[]>> {
    return this.http.get<Task[]>(this.tasksUrl + token, {observe:'response'})
  }

  saveTask(token:string,task: Task): Observable<HttpResponse<StringDto>> {
    console.log('saving in service called')
    console.log(this.tasksUrl + token)
    return this.http.post<StringDto>(this.tasksUrl + token, task, {observe:'response'})
  }

  updateTask(token:string,task: Task): Observable<HttpResponse<StringDto>> {
    return this.http.put<StringDto>(this.tasksUrl + token, task, {observe:'response'})
  }

  deleteTask(token:string,task: Task | number): Observable<HttpResponse<StringDto>> {
    const id = typeof task === 'number' ? task : task.frontId;
    const url = `${this.tasksUrl + token}/${id}`

    return this.http.delete<StringDto>(url, {observe:'response'})
  }
}
