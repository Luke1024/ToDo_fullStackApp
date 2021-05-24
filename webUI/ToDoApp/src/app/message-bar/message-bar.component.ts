import { Component, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/AppState';
import { ServerMessage } from '../models/server-message';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.css']
})
export class MessageBarComponent implements OnInit {

  appState$:Observable<any>

  messages:ServerMessage[] = []

  constructor(private store: Store<{appState:AppState}>, private element:ElementRef) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.updateMessage(app.serverMessages))
  }

  private updateMessage(serverMessages:ServerMessage[]){
    this.messages = serverMessages
    this.scrollToBottom()
  }

  private scrollToBottom(){
    const scrollPane: any = this.element.nativeElement.querySelector('#list-to-scroll')
    if(scrollPane) {
      setTimeout(()=> scrollPane.scrollTop = scrollPane.scrollHeight)
    }
  }

  ngOnInit(): void {
  }
}
