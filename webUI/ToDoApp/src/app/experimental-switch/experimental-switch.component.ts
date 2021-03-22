import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-experimental-switch',
  templateUrl: './experimental-switch.component.html',
  styleUrls: ['./experimental-switch.component.css']
})
export class ExperimentalSwitchComponent implements OnInit {

  @Input("fold") foldState:boolean
  @Output() foldSwitchEmitter: EventEmitter<boolean>

  constructor() {
    this.foldState = false
    this.foldSwitchEmitter = new EventEmitter
  }

  fold():void {
    this.foldState = false 
    this.foldSwitchEmitter.emit(this.foldState)
  }

  unfold():void {
    this.foldState = true
    this.foldSwitchEmitter.emit(this.foldState)
  }

  ngOnInit(): void {
  }
}
