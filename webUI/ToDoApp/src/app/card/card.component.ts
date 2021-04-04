import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { Store } from '@ngrx/store';
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

  @Input() id:number = 0
  task:Task

  constructor(private store: Store<{appState:AppState}>) { 
    this.message = ""
    this.folded = false
    this.task = {frontId:this.id,name:"Click to edit task.", description:"Task description", done:false}
  }

  ngOnInit(): void {
  }

  saveAndFold(): void {
    if(this.saveAllowed()){
      this.message = ""
      this.folded = true
      this.updateStore()
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
      this.updateStore()
    }else{
      this.message = "Task name can't be blank."
    }
  }

  markNotDone():void {
    if(this.saveAllowed()){
      this.message = ""
      this.task.done = false
      this.updateStore()
    }else{
      this.message = "Task name can't be blank."
    }
  }

  private updateStore(){
    this.store.dispatch(updateTask({task:this.task}))
  }

  delete(){
    this.store.dispatch(deleteTask({task:this.task}))
  }
}
