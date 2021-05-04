import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../AppState';
import { GetService } from '../task_service/get.service';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.css']
})
export class CardFilterComponent implements OnInit {

  constructor(private store: Store<{appState:AppState}>,
    private getService:GetService) { }

  ngOnInit(): void {
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
