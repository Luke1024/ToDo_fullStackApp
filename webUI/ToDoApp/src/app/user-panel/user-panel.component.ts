import { HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../LoginResponse';
import { Response } from '../Response';
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
  logInSignInSet:boolean = true
  emailLogOutSet:boolean = false
  email:string = ''

  //form visibility
  form:boolean = false

  //form button bar
  logInSet:boolean = false
  signInSet:boolean = false

  messageShow:boolean = true
  message:string = "Why this message is invisible?"

  //user variables
  usercredentials:UserCredentials = {userEmail:'', userPassword:''}
  tokenSet:boolean = false

  constructor(private connectionManager:ServerConnectionManagerService) { }

  ngOnInit():void {
    this.establishConnection()
  }

  private establishConnection():void {
    this.messageShow = true
    this.message="Connecting to server..."
    this.connectionManager.getToken().subscribe(isTokenSet => this.setConnectionMessage(isTokenSet))
  }

  private setConnectionMessage(isTokenSet:boolean){
    if(isTokenSet){
      this.message="Connected."
      setTimeout(()=> {
        this.messageShow = false
      },4000)
    } else {
      this.message="Server not responding."
    }    
  }

  loginForm():void {
    //user subbar
    this.logInSignInSet = false
    this.emailLogOutSet = false

    //form visibility
    this.form = true

    //form button bar
    this.logInSet = true
    this.signInSet = false

    this.messageShow = false
    this.message = ''
  }

  signInForm():void {
    //user subbar
    this.logInSignInSet = false
    this.emailLogOutSet = false
    
    //form visibility
    this.form = true
    
    //form button bar
    this.logInSet = false
    this.signInSet = true
    
    this.messageShow = false
    this.message = ''
  }

  cancel():void {
    //user subbar
    this.logInSignInSet = true
    this.emailLogOutSet = false
    
    //form visibility
    this.form = false
    
    //form button bar
    this.logInSet = false
    this.signInSet = false
    
    this.messageShow = false
    this.message = ''
  }

  login(userCredentials:UserCredentials):void {
    this.messageShow = true
    this.message = "Logging user..."
    this.connectionManager.loginUser(userCredentials).subscribe(response => {
       this.loginUserIfResponseCorrect(response, userCredentials)
    })
  }

  private loginUserIfResponseCorrect(response:LoginResponse, userCredentials:UserCredentials){

    //send message to server connection manager and next send information to task component to reload tasks

    if(response.status){
      if(response.tasksHttpResponse === undefined){
        this.message="User logged in."
        setTimeout(()=> {
        this.switchToLoggedView(userCredentials)
        },3000)
      } else {
        
      }
    } else {
      this.messageShow = true
      this.message = response.message
    }
  }

  private switchToLoggedView(userCredentials:UserCredentials){
    //user subbar
    this.logInSignInSet = false
    this.emailLogOutSet = true
    
    //form visibility
    this.form = false
    
    //form button bar
    this.logInSet = false
    this.signInSet = false
    
    this.messageShow = false
    this.message = ''
  }

  signin(userCredentials:UserCredentials):void {
    this.messageShow = true
    this.message = "Signing in user..."
    this.connectionManager.registerUser(userCredentials).subscribe(response => this.switchSignInView(response))
  }

  private switchSignInView(response:Response) {
    if(response.status){
      this.messageShow=true
      this.message=response.message
      setTimeout(()=> {
        this.switchToSignInView()
      },4000)
    } else {
      this.message = response.message
    }
  }

  private switchToSignInView():void {
    //user subbar
    this.logInSignInSet = false
    this.emailLogOutSet = true
        
    //form visibility
    this.form = false
        
    //form button bar
    this.logInSet = false
    this.signInSet = false

    this.messageShow=false
    this.message=''
  }

  logOut():void {
    this.messageShow = true
    this.message = "Logging out user..."
    this.connectionManager.logoutUser().subscribe(response => this.switchLogOutView(response))
  }

  private switchLogOutView(response:Response){
    if(response.status){
      this.messageShow=true
      this.message=response.message
      setTimeout(()=> {
      this.setLogOutView()
      },4000)
    }else{
      this.message = response.message
    }
  }

  private setLogOutView() {
    //user subbar
    this.logInSignInSet = true
    this.emailLogOutSet = false
            
    //form visibility
    this.form = false
            
    //form button bar
    this.logInSet = false
    this.signInSet = false
            
    this.messageShow = false
    this.message = ''

    this.usercredentials = {userEmail:'', userPassword:''}
  }
}
