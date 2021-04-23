export class LogOutService {
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

    logoutUser():void {
        this.addServerManagementMessage("Logging out user...",true,0)
        if(this.tokenReceived){
          this.userService.logout(this.token).subscribe(
            response => {
              this.analyzeLogoutResponse(response)
            }
          )
        } else {
          var message = 'Token not found.'
          this.addServerManagementMessage(message,false,0)
        }
      }
    
      private analyzeLogoutResponse(response:HttpResponse<StringDto>):void {
        //202
        if(response != null){
          var status = response.status
          if(response.body != null){
            var message:string = response.body.value
            if(status==202){
              this.updateUserStatusToLogout()
              this.addServerManagementMessage(message,true,4)
              this.setUserLoggedInFlag(false)
            }else{
              this.addServerManagementMessage(message,false,10)
            }
          }
        }
        this.addServerManagementMessage("There is a problem with logging out user.",false,5)
      }
    
      private updateUserStatusToLogout(){
        this.userEmail=''
        this.userLogged=false
      }
}