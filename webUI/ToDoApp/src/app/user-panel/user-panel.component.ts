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
  emailShow:boolean = false
  buttonPanelShow:boolean = false
  formShow:boolean = false
  messageShow:boolean = false
  cancelShow:boolean = false
  loginShow:boolean = false
  signinShow:boolean = false

  message:string = ''
  usercredentials:UserCredentials = {userEmail:'', userPassword:''}

  //user status


  tokenSet:boolean = false

  constructor(private connectionManager:ServerConnectionManagerService) { }

  ngOnInit():void {
    this.startConfig()
    this.establishConnection()
  }

  loginForm():void {
    this.buttonPanelShow = false
    this.formShow = true
    this.loginShow = true
  }

  signInForm():void {
    this.buttonPanelShow = false
    this.formShow = true
    this.signinShow = true
  }

  cancel():void {
    this.emailShow = false
    this.buttonPanelShow = true
    this.formShow = false
    this.cancelShow = false
    this.loginShow = false
    this.signinShow = false
  }

  login(userCredentials:UserCredentials):void {
    this.connectionManager.loginUser(userCredentials).subscribe(message => this.checkLoginMessage(message))
  }

  private checkLoginMessage(message:string) {
    if(message=="")
  }

  signin(userCredentials:UserCredentials):void {

  }

  private establishConnection():void {
    this.messageShow = true
    this.message="Connecting to server..."
    this.connectionManager.getToken().subscribe(isTokenSet => this.setConnectionMessage(isTokenSet))
  }

  private startConfig():void {
    this.emailShow = false
    this.buttonPanelShow = true
    this.formShow = false
    this.messageShow = false
    this.cancelShow = false
    this.loginShow = false
    this.signinShow = false
  }

  private setConnectionMessage(isTokenSet:boolean){
    if(isTokenSet){
      this.message="Connected."
      setTimeout(()=> {
        this.messageShow = false
      },2000)
    } else {
      this.message="Server not responding."
    }    
  }

}
