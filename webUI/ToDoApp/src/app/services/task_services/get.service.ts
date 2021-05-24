import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppState } from "../../store/AppState";
import { ServicesSettingsAndTools } from "../../services.settings.tools";
import { changeTaskListStatus, createMultipleCards } from "../../store/store-actions";
import { Task } from "../../models/task";
import { TaskListStatus } from "../../models/task-list-status";

@Injectable({
    providedIn: 'root'
})
export class GetService {
    token:string = ""

    appState$:Observable<any>

    constructor(private store: Store<{appState:AppState}>,
      private http:HttpClient,
      private serviceSettings:ServicesSettingsAndTools) {
      this.appState$ = store.select('appState')
      this.appState$.subscribe(app => this.token = app.token)
    }

    getAllTasks():void {
        if(this.serviceSettings.tokenReceived()){
            this.store.dispatch(changeTaskListStatus({taskListStatus:TaskListStatus.ALL}))
            this.http.get<Task[]>(this.serviceSettings.tasksUrl + this.token, {observe:'response'})
            .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
            .subscribe(response => this.analyzeGetTasksResponse(response))
        }
    }

    getDoneTasks():void {
        if(this.serviceSettings.tokenReceived()){
            this.store.dispatch(changeTaskListStatus({taskListStatus:TaskListStatus.DONE}))
            this.http.get<Task[]>(this.serviceSettings.tasksDoneUrl + this.token, {observe:'response'})
            .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
            .subscribe(response => this.analyzeGetTasksResponse(response))
        }
    }

    getTodoTasks():void {
        if(this.serviceSettings.tokenReceived()){
            this.store.dispatch(changeTaskListStatus({taskListStatus:TaskListStatus.TODO}))
            this.http.get<Task[]>(this.serviceSettings.tasksTodoUrl + this.token, {observe:'response'})
            .pipe(catchError(error => this.serviceSettings.handleHttpError(error)))
            .subscribe(response => this.analyzeGetTasksResponse(response))
        }
    }

    private analyzeGetTasksResponse(response:any):void{
        if(response != null){
            var status = response.status
            if(response.body != null){  
                if(status==200){
                    this.store.dispatch(createMultipleCards({cards:this.serviceSettings.convertTasks(response.body)}))
                    this.addMessage("Tasks reloaded",true,0)
            }
          }
        }
      }

    private addMessage(message:string, status:boolean, statusCode:number): void {
        this.serviceSettings.addServerManagementMessage(message, status, statusCode)
    }
}