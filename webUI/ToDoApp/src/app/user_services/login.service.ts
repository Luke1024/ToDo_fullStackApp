import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { AppState } from "../AppState"
import { ServerMessage } from "../server-message"
import { addServerManagementMessage } from "../store-actions"

export class LoginService {

    token:string = ""
    userLogged:boolean = false

    appState$:Observable<any>

    constructor(private store: Store<{appState:AppState}>) {
        this.appState$ = store.select('appState')
        this.appState$.subscribe(app => this.setState(app))
    }

    private setState(state:AppState):void {
        this.token = state.token
        this.userLogged = this.userLogged
    }

    
  loginUser(userCredentials: UserCredentials):void {
    if(this.connected){
      if(!userCredentials.userEmail || !userCredentials.userPassword){
        var message = 'Email and password can\'t be blank.'
        this.addServerManagementMessage(message,false,0)
      }else{
        this.userService.login(this.token, userCredentials).subscribe(
        response => { 
        this.analyzeLoginResponse(response, userCredentials)
        this.checkIfReloadTasks(response)
        })
      }
    } else {
      var message = 'Token not found.'
      this.addServerManagementMessage(message,false,0)
    }
  }

  private analyzeLoginResponse(response:HttpResponse<StringDto>, userCredentials:UserCredentials):void {
    if(response != null){
      var status = response.status
      if(response.body != null){  
        var message:string = response.body.value
        if(status==202){
          if(this.checkTokenLength(message)){
            this.updateUserStatusToLogin(userCredentials, message)
            this.setUserLoggedInFlag(true)
            this.addServerManagementMessage("User logged in.",true,4)
          }
        }
      }
    }
    this.addServerManagementMessage("There is a problem with a server response.",false,0)
  }

  private checkIfReloadTasks(response:HttpResponse<StringDto>):void {
    if(response != null)
      if(response.status){
        this.taskService.getTasks(this.token).subscribe(response => this.analyzeGetTasksResponse(response))
      }else{
        this.addServerManagementMessage("Cannot get user tasks.",false,0)
      }
    }

  private analyzeGetTasksResponse(response:HttpResponse<Task[]>):void{
    if(response != null){
      var status = response.status
      if(response.body != null){  
        if(status==200){
          this.sendTasks(response.body)
          this.addServerManagementMessage("Tasks reloaded",true,4)
        }
      }
    }
    this.addServerManagementMessage("There is problem with reloading tasks.",false,0)
  }

  private updateUserStatusToLogin(userCredentials:UserCredentials, token:string){
    this.token = token
    this.userLogged = true
    this.userEmail = userCredentials.userEmail
  }

  private addServerManagementMessage(message:string, status:boolean, statusCode:number){
    var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
    this.store.dispatch(addServerManagementMessage({message:serverMessage}))
  }
}