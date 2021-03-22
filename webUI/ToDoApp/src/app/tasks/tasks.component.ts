import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Response } from '../Response';
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

  private correctMessageTimeS = 2
  private errorMessageTimeS = 4 //0 is infinite

  private task:Task = {frontId:0,name:"Click to edit task.", description:"Task description", done:false}

  constructor(private serverManager:ServerConnectionManagerService) {}

  ngOnInit(): void {
    this.tasks.push(this.task)
    this.serverManager.taskPipeline$.subscribe(tasks => this.tasks = tasks)
  }

  saveUpdateTask(task:Task):void {
    if(this.checkIfSaveTask(task)) this.saveTask(task)
    if(this.checkIfUpdateTask(task)) this.updateTask(task)
  }

  private checkIfSaveTask(task:Task):boolean {
    if(this.tasks.filter(t => t.frontId == task.frontId).length == 0) return true
    else return false
  }

  private checkIfUpdateTask(task:Task):boolean {
    if(this.tasks.filter(t => t.frontId == t.frontId).length !== 0) return true
    else return false
  }

  delete(task:Task):void {
    this.tasks = this.tasks.filter(t => t.frontId !== t.frontId)
  }

  private saveTask(task:Task){
    this.serverManager.saveTask(task).subscribe(response => this.analyzeSaveTaskResponse(response,task))
  }

  private analyzeSaveTaskResponse(response:Response, task:Task){
    if(response.status){
      this.tasks.push((task))
    }
    //this.showCardMessage(response,task)
  }

  private updateTask(task:Task){
    this.serverManager.updateTask(task).subscribe(response => this.updateTaskIfStatusCorrect(response, task))
  }

  private updateTaskIfStatusCorrect(response:Response, task:Task){
    if(response.status){
      for(var i=0; i<this.tasks.length; i++){
        if(this.tasks[i].frontId == task.frontId){
          this.tasks[i] = task
        }
      }
    }
    //this.showCardMessage(response,task)
  }

  private deleteTask(task: Task): void {
      this.serverManager.deleteTask(task).subscribe(response => this.analyzeDeleteResponse(response,task))
  }

  private analyzeDeleteResponse(response:Response, task:Task){
    if(response.status){
      this.tasks = this.tasks.filter(t => t !== task)   
    }
    //this.showCardMessage(response, task)
  }

  add(): void {
    var id = this.generateId()
    var task:Task = {frontId:id,name:"Click to edit task.", description:"Task description", done:false}
    this.tasks.push(task)
  }

  private generateId():number {
    if(this.tasks.length==0){
      return 1
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
