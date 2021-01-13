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

  save(name:string, description:string){
    if(!name || !description){ return; }

  }

  delete(task: Task): void {
    this.tasks = this.tasks.filter(t => t != task);
  }

  add(): void {
    let maxNum:number = this.findMaxValue()
    this.tasks.push({id:maxNum, name:"", description:"",done:false})
  }

  markDone(task: Task): void {
    task.done = true
  }

  private findMaxValue():number {
    let maxNum:number = 0
    for(let i=0; i<this.tasks.length; i++){
      if(this.tasks[i].id > maxNum){
        maxNum = this.tasks[i].id
      }
    }
    return maxNum
  }
}
