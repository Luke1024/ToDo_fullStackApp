import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Task } from '../Task';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  message:string = ''

  @Input('task') task!: Task;
  @Output() updateTask: EventEmitter<Task>
  @Output() deleteTask: EventEmitter<Task>

  constructor() { 
    this.updateTask = new EventEmitter()
    this.deleteTask = new EventEmitter()
  }

  ngOnInit(): void {
  }

  update(task:Task){
    this.updateTask.emit(task)
  }

  delete(card:Task){
    this.deleteTask.emit(card)
  }
}
