export class SaveService {

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

    saveTask(task:Task): Observable<Response> {
        console.log('saving task')
        return new Observable(observer => {
    
        if(this.tokenReceived){
          this.taskService.saveTask(this.token, task)
          .subscribe(response => { 
            observer.next(this.analyzeSaveTaskResponse(response))})
        } else {
          var message = 'Token not found.'
          observer.next(new Response(false,message))
        }
      })}
    
      private analyzeSaveTaskResponse(response:HttpResponse<StringDto>):Response {
        return this.crudResponseAnalysis(response,"Problem with task saving.")
      }
}