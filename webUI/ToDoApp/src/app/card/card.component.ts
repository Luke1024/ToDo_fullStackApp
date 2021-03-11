import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Card } from '../Card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input('card') card!: Card;
  @Output() updateCard: EventEmitter<Card>
  @Output() deleteCard: EventEmitter<Card>

  constructor() { 
    this.updateCard = new EventEmitter()
    this.deleteCard = new EventEmitter()
  }

  ngOnInit(): void {
  }

  update(card:Card){
    if(!card.task.name || !card.task.description){
      this.card.messageShow = true
      this.card.message = 'Task name and task description can\'t be blank.'
    } else {
      this.updateCard.emit(card)
    }
  }

  delete(card:Card){
    this.deleteCard.emit(card)
  }
}
