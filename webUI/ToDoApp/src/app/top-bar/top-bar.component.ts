import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';
import { FormPanelMode } from '../form-panel-mode';
import { setFormPanelMode } from '../store-actions';
import { TopBar } from '../top-bar';
import { LogOutService } from '../user_services/logOut.service';

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

  constructor(private store:Store<{appState:AppState}>,
    private logOutService:LogOutService) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.setStates(app))
  }

  setStates(appState:AppState){
    this.barMessage = appState.topBarMessage
    var userLogged = appState.userLogged
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
    this.store.dispatch(setFormPanelMode({mode:FormPanelMode.LOG_IN}))
  }

  signIn(): void {
    this.store.dispatch(setFormPanelMode({mode:FormPanelMode.SIGN_IN}))
  }

  logOut(): void {
    this.logOutService.logoutUser()
  }
}
