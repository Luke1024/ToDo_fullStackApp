import { Component, OnInit } from '@angular/core';
import { Task } from '../Task';
import { TaskServiceService } from '../task-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks:Task[] = []

  constructor(private taskService:TaskServiceService) { }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks()
  }
}
