import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Response } from '../Response';
import { ServerConnectionManagerService } from '../server-connection-manager.service';
import { StringDto } from '../StringDto';
import { Task } from '../Task';
import { TaskServiceService } from '../task-service.service';
import { Card } from '../Card';
import { CardFactory } from './CardFactory';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  cards:Card[] = []
  cardFactory:CardFactory = new CardFactory()

  private correctMessageTimeS = 4
  private errorMessageTimeS = 0 //0 is infinite

  constructor(private serverManager:ServerConnectionManagerService) {}

  ngOnInit(): void {
    this.cards.push(this.cardFactory.generate("new task",'task description',this.cards))
    this.serverManager.taskPipeline$.subscribe(tasks => this.cards = this.cardFactory.generateFromTasks(tasks))
  }

  saveTask(task:Task){
    this.serverManager.saveTask(task).subscribe(response => this.analyzeSaveTaskResponse(response,task))
  }

  private analyzeSaveTaskResponse(response:Response, task:Task){
    if(response.status){
      this.cards.push(this.cardFactory.generateFromTask(task))
    }
    this.showCardMessage(response,task)
  }

  updateTask(task:Task){
    this.serverManager.updateTask(task).subscribe(response => this.updateTaskIfStatusCorrect(response, task))
  }

  private updateTaskIfStatusCorrect(response:Response, task:Task){
    if(response.status){
      for(var i=0; i<this.cards.length; i++){
        if(this.cards[i].task.frontId == task.frontId){
          this.cards[i].task = task
        }
      }
    }
    this.showCardMessage(response,task)
  }

  deleteTask(task: Task): void {
      this.serverManager.deleteTask(task).subscribe(response => this.analyzeDeleteResponse(response,task))
  }

  private analyzeDeleteResponse(response:Response, task:Task){
    if(response.status){
      this.cards = this.cards.filter(c => c.task !== task)   
    }
    this.showCardMessage(response, task)
  }

  add(): void {
    this.cards.push(this.cardFactory.generate("", "",this.cards))
  }

  markDone(task: Task): void {
    console.log(task)
    task.done = true
    this.updateTask(task)  }


  private showCardMessage(response:Response, task:Task):void {
    for(var i=0; i<this.cards.length; i++){
      if(this.cards[i].task.frontId = task.frontId){
        var card = this.cards[i]
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
}
