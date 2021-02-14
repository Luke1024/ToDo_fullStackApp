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
    this.connectionManager.loginUser(userCredentials).subscribe(message => {
       this.loginUserIfResponseCorrect(message, userCredentials)
    })
  }

  private loginUserIfResponseCorrect(message:string, userCredentials:UserCredentials){
    if(message.length==this.connectionManager.getAcceptedTokenLength()){
      this.message="User logged in."
      setTimeout(()=> {
      this.switchToLoggedView(userCredentials)
      },4000)
    } else {
      this.message = message
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
    this.connectionManager.registerUser(userCredentials).subscribe(message => this.switchSignInView(message))
  }

  private switchSignInView(message:string) {
    if(message=="User registered."){
      setTimeout(()=> {
        this.switchToSignInView()
      },4000)
    } else {
      this.message = message
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
        
    this.messageShow = false
    this.message = ''
  }

  logOut():void {
    this.messageShow = true
    this.message = "Logging out user..."
    this.connectionManager.logoutUser().subscribe(message => this.switchLogOutView(message))
  }

  private switchLogOutView(message:string){
    if(message=="User succesfully logged out."){
      setTimeout(()=> {
      this.setLogOutView()
      },4000)
    }else{
      this.message = message
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
