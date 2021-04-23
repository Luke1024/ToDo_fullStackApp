export class RegistrationService {
    
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

    registerUser(userCredentials: UserCredentials):void {
        this.addServerManagementMessage("Registering user...",true,0)
        if(this.tokenReceived){
          if(!userCredentials.userEmail || !userCredentials.userPassword){
            var message = 'Email and password can\'t be blank.'
            this.addServerManagementMessage(message,false,4)
          }else{
            this.userService.register(this.token, userCredentials).subscribe(
              response => { 
                this.analyzeRegisterResponse(response)
              }
            )
          }
        } else {
          var message = 'Token not found.'
          this.addServerManagementMessage(message,false,0)
        }
      }
    
      private analyzeRegisterResponse(response:HttpResponse<StringDto>):void {
        if(response != null){
          var status = response.status
          if(response.body != null){
            var message:string = response.body.value
            if(status==202){
              this.addServerManagementMessage(message,true,4)
            }else{
              this.addServerManagementMessage(message,false,10)
            }
          }
        }
        this.crudResponseAnalysis(response,"There is a problem with registering user.")
    }

    private addServerManagementMessage(message:string, status:boolean, statusCode:number){
        var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
        this.store.dispatch(addServerManagementMessage({message:serverMessage}))
    }
}