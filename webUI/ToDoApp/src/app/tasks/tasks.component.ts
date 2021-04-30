import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StringDto } from '../StringDto';
import { Task } from '../Task';
import { TaskServiceService } from '../task-service.service';
import { AppState } from '../AppState';
import { createCard } from '../store-actions'
import { Card } from '../Card';
import { SaveService } from '../task_service/save.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  cards:Card[] = []

  appState$:Observable<any>

  constructor(private store: Store<{appState:AppState}>, private saveService:SaveService) {
      this.appState$ = store.select('appState')
      this.appState$.subscribe(app => this.cards = app.cards)
    }

  ngOnInit(): void {
    //var card:Card = {frontId:0,taskName:"", description:"", done:false, message:"", messageShow:false, editMode:true, folded:false}
    //this.store.dispatch(createCard({card}))
  }

  add(): void {
    var id = this.generateId()
    var card:Card = {frontId:id,taskName:"", description:"", done:false, message:"", messageShow:false, editMode:true, folded:false}
    this.saveService.saveTask(card)
  }

  private generateId():number {
    if(this.cards.length==0){
      return 0
    }
    var maxNum:number = 0
    for(var i=0; i<this.cards.length; i++){
      if(this.cards[i].frontId > maxNum){
        maxNum = this.cards[i].frontId
      }
    }
    return maxNum + 1
  }
}
