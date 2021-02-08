import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ServerConnectionManagerService } from '../server-connection-manager.service';
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
  message:string = ''
  cardMessage:string = ''

  constructor(private serverManager:ServerConnectionManagerService) { }

  ngOnInit(): void {
    this.tasks.push({frontId:1, name:"new task", description:'task description',done:false})
  }

  saveTask(task:Task){
    this.serverManager.saveTask(task).subscribe(message => this.saveTaskIfMessageCorrect(message,task))
  }

  private saveTaskIfMessageCorrect(message:string, task:Task){
    if(message=="Task saved."){
      this.tasks.push(task)
    }
  }

  updateTask(task:Task){
    this.serverManager.updateTask(task).subscribe(message => this.updateTaskIfMessageCorrect(message))
  }

  private updateTaskIfMessageCorrect(message:StringDto){
    if(message=="Task updated."){
      this.tasks
    }
    //save task
  }

  deleteTask(task: Task): void {
    if(this.tokenReceived){
      this.tasks = this.tasks.filter(t => t != task);
      this.restService.deleteTask(this.token,task).subscribe()
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

  private showCardMessage(message:string, timeS:number):void {
    //catch null
  }
}
