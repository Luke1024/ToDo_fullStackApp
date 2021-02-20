import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Response } from '../Response';
import { ServerConnectionManagerService } from '../server-connection-manager.service';
import { StringDto } from '../StringDto';
import { Task } from '../Task';
import { TaskServiceService } from '../task-service.service';
import { Card } from './Card';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  cards:Card[] = []

  constructor(private serverManager:ServerConnectionManagerService) { }

  ngOnInit(): void {
    this.cards.push({frontId:1, name:"new task", description:'task description',done:false})
    this.serverManager.taskPipeline$.subscribe(tasks => this.tasks = tasks)
  }

  private cardFactory()

  saveTask(task:Task){
    this.serverManager.saveTask(task).subscribe(response => this.analyzeSaveTaskResponse(response,task))
  }

  private analyzeSaveTaskResponse(response:Response, task:Task){
    if(response.status){
      this.tasks.push(task)
    }
    this.showCardMessage(response, 2)
  }

  updateTask(task:Task){
    this.serverManager.updateTask(task).subscribe(response => this.updateTaskIfMessageCorrect(response, task))
  }

  private updateTaskIfMessageCorrect(response:Response, task:Task){
    if(response.status){
      for(var i=0; i<this.tasks.length; i++){
        if(this.tasks[i].frontId == task.frontId){
          this.tasks[i] = task
        }
      }
    }
    this.showCardMessage(response,2)
  }

  deleteTask(task: Task): void {
      this.serverManager.deleteTask(task).subscribe(message => this.showCardMessage(message,2))
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

  private showCardMessage(response:Response, timeS:number):void {
    this.cardMessage = message
    this.cardMessageShow = true
    setTimeout(() => this.removeMessage(),timeS*1000)
  }

  private removeMessage(): void {
    this.cardMessage=''
    this.cardMessageShow = false
  }
}
