import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../AppState';
import { FormPanelMode } from '../form-panel-mode';
import { setFormPanelVisibleToFalse } from '../store-actions';
import { UserCredentials } from '../UserCredentials';
import { LoginService } from '../user_services/login.service';
import { LogOutService } from '../user_services/logOut.service';
import { RegistrationService } from '../user_services/registration.service';

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

  constructor(private store:Store<{appState:AppState}>,
    private logInService:LoginService,
    private registrationService:RegistrationService,
    private logOutService:LogOutService) {
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
    var credentials:UserCredentials = {userEmail:this.email, userPassword:this.password}
    this.logInService.loginUser(credentials)
  }

  signIn() {
    var credentials:UserCredentials = {userEmail:this.email, userPassword:this.password}
    this.registrationService.registerUser(credentials)
  }

  cancel() {
    this.store.dispatch(setFormPanelVisibleToFalse())
  }
}
