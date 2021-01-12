import { Injectable } from '@angular/core';
import { Task } from './Task';
 
@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  tasks:Task[] = []

  constructor() {
    this.generateTasks()
  }

  private generateTasks():void {
    for(var i=0; i<10; i++){
      this.tasks.push({id:i,name:"Task " + i,description: "Description " + i, done:false})
    }
  }

  getTasks(): Task[] {
    return this.tasks
  }
}
