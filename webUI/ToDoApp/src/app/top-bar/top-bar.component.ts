import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {



  appState$:Observable<any>

  constructor(private store:Store<{appState:AppState}>) {
    this.appState$ = store.select('appState')
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
