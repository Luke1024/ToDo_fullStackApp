import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';
import { ServerMessage } from '../server-message';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.css']
})
export class MessageBarComponent implements OnInit {

  appState$:Observable<any>

  messages:ServerMessage[] = []

  constructor(private store: Store<{appState:AppState}>) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.messages = app.serverMessages)
  }

  ngOnInit(): void {
  }

}
