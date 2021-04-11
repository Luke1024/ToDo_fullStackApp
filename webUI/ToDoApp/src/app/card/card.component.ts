import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeLast } from 'rxjs/operators';
import { AppState } from '../AppState';
import { setStatusToFalse, setStatusToTrue, addServerMessage,
  setUserToken, createTask,
  updateTask, deleteTask } from '../store-actions';
import { Task } from '../Task';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  message:string
  folded:boolean 

  name:string = ''
  description:string = ''

  @Input() task!:Task

  constructor(private store: Store<{appState:AppState}>) { 
    this.message = ""
    this.folded = false
  }

  ngOnInit(): void {
    this.name = this.task.name
    this.description = this.task.description
  }

  saveAndFold(name:string, description:string): void {
    if(this.saveAllowed(name)){
      this.message = ""
      this.folded = true
      this.updateStore(name, description)
    } else {
      this.message = "Task name can't be blank."
    }
  }

  unfold(): void {
    this.folded = false
  }

  private saveAllowed(name:string):boolean {
    if(name.length==0){
      return false
    }else {
      return true
    }
  }

  markDone(name:string, description:string):void {
    if(this.saveAllowed(name)){
      this.message = ""
      this.task.done = true
      this.updateStore(name, description)
    }else{
      this.message = "Task name can't be blank."
    }
  }

  markNotDone(name:string, description:string):void {
    if(this.saveAllowed(name)){
      this.message = ""
      this.task.done = false
      this.updateStore(name, description)
    }else{
      this.message = "Task name can't be blank."
    }
  }

  private updateStore(name:string, description:string){
    var task = Object.assign({},this.task)
    task.name = name
    task.description = description
    this.store.dispatch(updateTask({task:task}))
  }

  delete(){
    this.store.dispatch(deleteTask({task:this.task}))
  }
}
