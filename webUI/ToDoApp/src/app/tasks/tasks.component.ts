import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { StringDto } from '../StringDto';
import { Task } from '../Task';
import { TaskServiceService } from '../task-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks:Task[] = []

  private token:String = ''
  private tokenReceived = false

  constructor(private taskService:TaskServiceService) { }

  ngOnInit(): void {
    this.taskService.getToken().subscribe(token => this.setToken(token))
    this.tasks.push({frontId:1, name:"new task", description:'task description',done:false})
  }

  private setToken(token:StringDto) {
    this.tokenReceived = true
    this.token = token.value
    console.log('token received ' + token.value)
  }

  saveTask(task:Task){
    console.log('saving task')
    if(this.tokenReceived){
      if(!task.name || !task.description){
         console.log('something not found') 
         return; 
      }
      this.taskService.saveTask(this.token, task).subscribe()
    } else {
      console.log('Token not found.')
    }
  }

  updateTask(task:Task){
    if(this.tokenReceived){
      if(!task.name || !task.description){ return; }
      this.taskService.updateTask(this.token,task).subscribe()
    }
  }

  deleteTask(task: Task): void {
    if(this.tokenReceived){
      this.tasks = this.tasks.filter(t => t != task);
      this.taskService.deleteTask(this.token,task).subscribe()
    }
  }

  add(): void {
    let maxNum:number = this.findNextValue()
    this.tasks.push({frontId:maxNum, name:"", description:"",done:false})
  }

  markDone(task: Task): void {
    console.log(task)
    task.done = true
    this.updateTask(task)  }

  private findNextValue():number {
    let maxNum:number = 0
    for(let i=0; i<this.tasks.length; i++){
      if(this.tasks[i].frontId > maxNum){
        maxNum = this.tasks[i].frontId
      }
    }
    return maxNum + 1
  }
}
