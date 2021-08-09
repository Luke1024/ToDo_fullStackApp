import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/AppState';
import { FormPanelMode } from '../models/form-panel-mode';
import { setFormPanelMode } from '../store/store-actions';
import { UserCredentials } from '../models/user-credentials';
import { LoginService } from '../services/user_services/login.service';
import { LogOutService } from '../services/user_services/logOut.service';
import { RegistrationService } from '../services/user_services/registration.service';

@Component({
  selector: 'app-form-panel',
  templateUrl: './form-panel.component.html',
  styleUrls: ['./form-panel.component.css']
})
export class FormPanelComponent implements OnInit {

  email:string = ""
  password:string = ""
  formVisibility!:boolean

  logInButton!:boolean
  signUpButton!:boolean

  panelVisible!:boolean
  message!:string

  appState$:Observable<any>

  constructor(private store:Store<{appState:AppState}>,
    private logInService:LoginService,
    private registrationService:RegistrationService) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.setStates(app))
  }

  ngOnInit(): void {
  }

  setStates(appState:AppState){
    switch(appState.formPanelMode){
      case FormPanelMode.LOG_IN:
        this.clearForm()
        this.logInButton = true
        this.signUpButton = false
        this.formVisibility = true
        break;
      case FormPanelMode.SIGN_IN:
        this.clearForm()
        this.logInButton = false
        this.signUpButton = true
        this.formVisibility = true
        break;
      case FormPanelMode.NOT_VISIBLE:
        this.clearForm()
        this.formVisibility = false
        break;
    }
  }

  logIn() {
    var credentials:UserCredentials = {userEmail:this.email, userPassword:this.password}
    this.logInService.loginUser(credentials)
    this.clearForm()
  }

  signUp() {
    var credentials:UserCredentials = {userEmail:this.email, userPassword:this.password}
    this.registrationService.registerUser(credentials)
    this.clearForm()
  }

  cancel() {
    this.clearForm()
    this.store.dispatch(setFormPanelMode({mode:FormPanelMode.NOT_VISIBLE}))
  }

  private clearForm(){
    this.email = ""
    this.password = ""
  }
}
