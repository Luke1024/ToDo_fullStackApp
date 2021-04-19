import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';
import { TopBar } from '../top-bar';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  topBar!:TopBar
  appState$:Observable<any>

  constructor(private store:Store<{appState:AppState}>) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.appState$ = app.topBar)
  }

  ngOnInit(): void {
  }

  logIn(): void {
    
  }

  signIn(): void {

  }

  logOut(): void {
    
  }
}
