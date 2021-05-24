import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/AppState';
import { TaskListStatus } from '../models/task-list-status';
import { GetService } from '../services/task_services/get.service';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.css']
})
export class CardFilterComponent implements OnInit {

  taskListStatus:TaskListStatus = TaskListStatus.ALL

  search:string = ""

  appState$:Observable<any>

  constructor(private store: Store<{appState:AppState}>,
    private getService:GetService) { 
      this.appState$ = store.select('appState')
      this.appState$.subscribe(app => this.setStatus(app.taskListStatus))
    }

  ngOnInit(): void {
  }

  private setStatus(taskListStatus:TaskListStatus){
    if(taskListStatus == TaskListStatus.ALL){
      this.model = {all:true, todo:false, done:false}
    }
    if(taskListStatus == TaskListStatus.TODO){
      this.model = {all:false, todo:true, done:false}
    }
    if(taskListStatus == TaskListStatus.DONE){
      this.model = {all:false, todo:false, done:true}
    }
  }

  model = {
    all: true,
    todo: false,
    done: false,
  }

  all():void {
    this.getService.getAllTasks()
  }

  toDo():void {
    this.getService.getTodoTasks()
  }

  done():void {
    this.getService.getDoneTasks()
  }
}
