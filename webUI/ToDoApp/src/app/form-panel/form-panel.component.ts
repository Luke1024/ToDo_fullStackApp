import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';
import { FormPanelMode } from '../form-panel-mode';
import { setFormPanelVisibleToFalse } from '../store-actions';

@Component({
  selector: 'app-form-panel',
  templateUrl: './form-panel.component.html',
  styleUrls: ['./form-panel.component.css']
})
export class FormPanelComponent implements OnInit {

  email:string = ""
  password:string = ""
  formVisibility!:boolean
  messageVisibility!:boolean

  logInButton!:boolean
  signInButton!:boolean

  panelVisible!:boolean
  message!:string

  appState$:Observable<any>

  constructor(private store:Store<{appState:AppState}>) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.setStates(app))
  }

  ngOnInit(): void {
  }

  setStates(appState:AppState){
    this.panelVisible = appState.formPanelVisible
    switch(appState.formPanelMode){
      case FormPanelMode.LOG_IN:
        this.logInButton = true
        this.signInButton = false
        this.formVisibility = true
        this.messageVisibility = false
        break;
      case FormPanelMode.SIGN_IN:
        this.logInButton = false
        this.signInButton = true
        this.formVisibility = true
        this.messageVisibility = false
        break;
      case FormPanelMode.WAITING:
        this.formVisibility = false
        this.messageVisibility = true
        break;
    }
  }

  logIn() {

  }

  signIn() {

  }

  cancel() {
    this.store.dispatch(setFormPanelVisibleToFalse())
  }
}
