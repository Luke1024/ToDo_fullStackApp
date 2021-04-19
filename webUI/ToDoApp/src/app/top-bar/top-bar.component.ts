import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';
import { FormPanelMode } from '../form-panel-mode';
import { setDisableButtonsToTrue, setFormPanelMode, setFormPanelVisibleToTrue } from '../store-actions';
import { TopBar } from '../top-bar';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  logInSignInVisible!:boolean
  logOutVisible!:boolean
  barMessage:string = ""

  appState$:Observable<any>

  constructor(private store:Store<{appState:AppState}>) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.setStates(app))
  }

  setStates(appState:AppState){
    this.barMessage = appState.topBarMessage
    var disableButtons = appState.topBarDisableButtons
    var userLogged = appState.userLogged
    if(disableButtons){

    } else {

    }
    if(userLogged){
      this.logOutVisible=true
      this.logInSignInVisible=false
    }else{
      this.logOutVisible=false
      this.logInSignInVisible=true
    }
  }

  ngOnInit(): void {
  }

  logIn(): void {
    this.store.dispatch(setFormPanelVisibleToTrue())
    this.store.dispatch(setDisableButtonsToTrue())
    this.store.dispatch(setFormPanelMode({mode:FormPanelMode.LOG_IN}))
  }

  signIn(): void {
    this.store.dispatch(setFormPanelVisibleToTrue())
    this.store.dispatch(setDisableButtonsToTrue())
    this.store.dispatch(setFormPanelMode({mode:FormPanelMode.SIGN_IN}))
  }

  logOut(): void {

  }
}
