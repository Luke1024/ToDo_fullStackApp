import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Task } from '../Task';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  message:string
  folded:boolean 

  @Input() task!: Task;
  @Output() updateTask: EventEmitter<Task>
  @Output() deleteTask: EventEmitter<Task>

  constructor() { 
    this.message = ""
    this.folded = false
    this.updateTask = new EventEmitter()
    this.deleteTask = new EventEmitter()
  }

  ngOnInit(): void {
  }

  saveAndFold(): void {
    if(this.saveAllowed()){
      this.message = ""
      this.folded = true
      this.updateTask.emit(this.task)
    } else {
      this.message = "Task name can't be blank."
    }
  }

  unfold(): void {
    this.folded = false
  }

  private saveAllowed():boolean {
    if(this.task.name.length==0){
      return false
    }else {
      return true
    }
  }

  markDone():void {
    if(this.saveAllowed()){
      this.message = ""
      this.task.done = true
      this.updateTask.emit(this.task)
    }else{
      this.message = "Task name can't be blank."
    }
  }

  markNotDone():void {
    if(this.saveAllowed()){
      this.message = ""
      this.task.done = false
      this.updateTask.emit(this.task)
    }else{
      this.message = "Task name can't be blank."
    }
  }

  delete(){
    this.deleteTask.emit(this.task)
  }
}
