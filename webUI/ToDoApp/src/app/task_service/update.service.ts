export class UpdateService {

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

    updateTask(task: Task): Observable<Response> {
        console.log('updating task')
        return new Observable(observer => {
    
        if(this.tokenReceived){
          if(!task.taskName || !task.description){
            this.taskService.updateTask(this.token, task)
            .subscribe(response => { 
              observer.next(this.analyzeUpdateResponse(response))
            })
          }
        } else {
          var message = 'Token not found.'
          observer.next(new Response(false,message))
        }
        })
      }
    
      private analyzeUpdateResponse(response:HttpResponse<StringDto>){
        return this.crudResponseAnalysis(response,"Problem with task updating.")
      }
}