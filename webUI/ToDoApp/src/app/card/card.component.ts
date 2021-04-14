import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeLast } from 'rxjs/operators';
import { AppState } from '../AppState';
import { Card } from '../Card';
import { setStatusToFalse, setStatusToTrue, addServerMessage,
  setUserToken, createCard,
  updateCard, deleteCard } from '../store-actions';
import { Task } from '../Task';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit { 

  @Input() cardInput!:Card

  card!:Card

  constructor(private store: Store<{appState:AppState}>) { 
    
  }

  ngOnInit(): void {
    this.card = Object.assign({},this.cardInput)
  }

  save(): void {
    if(this.saveAllowed()){
      this.card.messageShow = false
      this.card.message = ""
      this.updateStore()
    } else {
      this.card.messageShow = true
      this.card.message = "Task name can't be blank."
      this.updateStore()
    }
  }

  unfold(): void {
    var card = Object.assign({}, this.cardInput)
    card.folded = false
    this.updateStore()
  }

  private saveAllowed():boolean {
    if(this.card.taskName.length==0){
      return false
    }else {
      return true
    }
  }

  private updateStore(){
    this.store.dispatch(updateCard({card:this.card}))
  }

  delete(){
    this.store.dispatch(deleteCard({card:this.cardInput}))
  }

  updater(){
    this.save()
  }
}
