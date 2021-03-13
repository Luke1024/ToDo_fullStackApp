import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../Task';

@Component({
  selector: 'app-card-control-panel',
  templateUrl: './card-control-panel.component.html',
  styleUrls: ['./card-control-panel.component.css']
})
export class CardControlPanelComponent implements OnInit {

  @Input("task")task!: Task
  @Output() folded: EventEmitter<boolean>
  @Output() updateTask: EventEmitter<Task>
  @Output() deleteTask: EventEmitter<Task>

  constructor() {
    this.folded = new EventEmitter
    this.updateTask = new EventEmitter
    this.deleteTask = new EventEmitter
  }

  update(task:Task):void {
    this.updateTask.emit(task)
  }

  ngOnInit(): void {
  }
}
