import { HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServerConnectionManagerService } from '../server-connection-manager.service';
import { UserServiceService } from '../user-service.service';
import { UserCredentials } from '../UserCredentials';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  //visibility variables
  //user subbar
  logInRegisterBarActive:boolean = true
  emailLogOutActive:boolean = false
  email:string = ''

  //form visibility
  formActive:boolean = false

  //form button bar
  logInButton:boolean = false
  signInButton:boolean = false

  messageShow:boolean = true
  message:string = "Why this message is invisible?"
  messageStatus:boolean = true

  //user variables
  usercredentials:UserCredentials = {userEmail:'', userPassword:''}
  loggedIn:boolean = false

  constructor(private connectionManager:ServerConnectionManagerService) { }

  ngOnInit():void {
    this.connectionManager.userPanelMessage$.subscribe(message => this.message = message)
    this.connectionManager.userPanelMessageVisibilitySwitch$.subscribe(show => this.messageShow = show)
    this.connectionManager.userPanelMessageStatus$.subscribe(status => this.messageStatus = status)
    this.connectionManager.userLogInFlag$.subscribe(flag => this.switchLogInView(flag))
  }

  private switchLogInView(flag:boolean){
    if(flag==true){
      this.loggedIn = true
      this.switchToLoggedView()
    }else{
      this.loggedIn = false
      this.switchToLoggedOutView()
    }
  }

  loginForm():void {
    //user subbar
    this.logInRegisterBarActive = false
    this.emailLogOutActive = false

    //form visibility
    this.formActive = true

    //form button bar
    this.logInButton = true
    this.signInButton = false

    this.messageShow = false
    this.message = ''
  }

  signInForm():void {
    //user subbar
    this.logInRegisterBarActive = false
    this.emailLogOutActive = false
    
    //form visibility
    this.formActive = true
    
    //form button bar
    this.logInButton = false
    this.signInButton = true
    
    this.messageShow = false
    this.message = ''
  }

  cancel():void {
    //user subbar
    this.logInRegisterBarActive = true
    this.emailLogOutActive = false
    
    //form visibility
    this.formActive = false
    
    //form button bar
    this.logInButton = false
    this.signInButton = false
    
    this.messageShow = false
    this.message = ''
  }

  login(userCredentials:UserCredentials):void {
    this.connectionManager.loginUser(userCredentials)
  }

  private switchToLoggedView(){
    //user subbar
    this.logInRegisterBarActive = false
    this.emailLogOutActive = true
    
    //form visibility
    this.formActive = false
    
    //form button bar
    this.logInButton = false
    this.signInButton = false
    
    this.messageShow = false
    this.message = ''

    this.email = this.usercredentials.userEmail
  }

  register(userCredentials:UserCredentials):void {
    this.connectionManager.registerUser(userCredentials)
  }

  logOut():void {
    this.connectionManager.logoutUser()
  }

  private switchToLoggedOutView(){
    //user subbar
    this.logInRegisterBarActive = true
    this.emailLogOutActive = false
            
    //form visibility
    this.formActive = false
            
    //form button bar
    this.logInButton = false
    this.signInButton = false
            
    this.messageShow = false
    this.message = ''

    this.usercredentials = {userEmail:'', userPassword:''}
  }
}
