export class DeleteService {

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

    deleteTask(task: Task): Observable<Response> {
        return new Observable(observer => {
          this.taskService.deleteTask(this.token,task).subscribe(response => observer.next(this.analyzeDeleteResponse(response)))
        })
      }
    
      private analyzeDeleteResponse(response:HttpResponse<StringDto>){
        return this.crudResponseAnalysis(response,"Problem with task deleting.")
      }
}