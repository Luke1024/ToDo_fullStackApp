import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeLast } from 'rxjs/operators';
import { AppState } from '../AppState';
import { Card } from '../Card';
import { setStatusToFalse, setStatusToTrue, addServerMessage,
  setUserToken, createCard,
  updateCard, deleteCard } from '../store-actions';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit { 

  name:string = ''
  description:string = ''

  @Input() card!:Card

  constructor(private store: Store<{appState:AppState}>) { 
    
  }

  ngOnInit(): void {
    this.name = this.card.task.taskName
    this.description = this.card.task.description
  }

  saveAndFold(name:string, description:string): void {
    var card = Object.assign({}, this.card)
    var task = Object.assign({}, this.card.task)
    if(this.saveAllowed(name)){
      var card = Object.assign({}, this.card)
      var task = Object.assign({}, this.card.task)
      card.messageShow = false
      card.message = ""
      card.folded = true
      task.taskName = name
      task.description = description
      card.task = task
      this.updateStore(card)
    } else {
      card.messageShow = true
      card.message = "Task name can't be blank."
      this.updateStore(card)
    }
  }

  unfold(): void {
    var card = Object.assign({}, this.card)
    card.folded = false
    this.updateStore(card)
  }

  private saveAllowed(name:string):boolean {
    if(name.length==0){
      return false
    }else {
      return true
    }
  }

  markDone(name:string, description:string):void {
    var card = Object.assign({}, this.card)
    var task = Object.assign({}, this.card.task)
    if(this.saveAllowed(name)){
      card.messageShow = false
      card.message = ""
      task.done = true
      task.taskName = name
      task.description = description
      card.task = task
      this.updateStore(card)
    }else{
      card.messageShow = true
      card.message = "Task name can't be blank."
      this.updateStore(card)
    }
  }

  markNotDone(name:string, description:string):void {
    var card = Object.assign({}, this.card)
    var task = Object.assign({}, this.card.task)
    if(this.saveAllowed(name)){
      card.message = ""
      task.done = false
      task.taskName = name
      task.description = description
      card.task = task
      this.updateStore(card)
    }else{
      card.messageShow = true
      card.message = "Task name can't be blank."
      this.updateStore(card)
    }
  }

  private updateStore(card:Card){
    this.store.dispatch(updateCard({card:card}))
  }

  delete(){
    this.store.dispatch(deleteCard({card:this.card}))
  }
}
