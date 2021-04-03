import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Response } from '../Response';
import { ServerConnectionManagerService } from '../server-connection-manager.service';
import { StringDto } from '../StringDto';
import { Task } from '../Task';
import { TaskServiceService } from '../task-service.service';
import { AppState } from '../AppState';
import { setStatusToFalse, setStatusToTrue, addServerMessage,
  setUserToken, createTask,
  updateTask, deleteTask } from '../store-actions'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks:Task[] = []

  appState$:Observable<any>

  private correctMessageTimeS = 2
  private errorMessageTimeS = 4 //0 is infinite

  private task:Task = {frontId:0,name:"Click to edit task.", description:"Task description", done:false}

  constructor(private serverManager:ServerConnectionManagerService, 
    private store: Store<{appState:AppState}>) {
      this.appState$ = store.select('appState')
      this.appState$.subscribe(app => this.tasks = app.tasks)
    }

  ngOnInit(): void {
    //this.tasks.push(this.task)
    //this.serverManager.taskPipeline$.subscribe(tasks => this.tasks = tasks)
  }

  saveUpdateTask(task:Task):void {
    this.store.dispatch(updateTask({task}))
  }

  delete(task:Task):void {
    this.store.dispatch(deleteTask({task}))
  }

  add(): void {
    var id = this.generateId()
    var task:Task = {frontId:id,name:"Click to edit task.", description:"Task description", done:false}
    this.store.dispatch(createTask({task}))
  }

  private generateId():number {
    if(this.tasks.length==0){
      return 0
    }
    var maxNum:number = 0
    for(var i=0; i<this.tasks.length; i++){
      if(this.tasks[i].frontId > maxNum){
        maxNum = this.tasks[i].frontId
      }
    }
    return maxNum + 1
  }
/*
  private showCardMessage(response:Response, task:Task):void {
    for(var i=0; i<this.tasks.length; i++){
      if(this.tasks[i].task.frontId == task.frontId){
        var card = this.tasks[i]
        card.message = response.message
        card.messageShow = true
        card.messageStatus = response.status
        if(response.status){
          setTimeout(() => card.messageShow = false, this.correctMessageTimeS * 1000)
        }else{
          if(this.errorMessageTimeS != 0){
            setTimeout(() => card.messageShow = false, this.errorMessageTimeS * 1000)
          }
        }
      }
    }
  }
  */
}
