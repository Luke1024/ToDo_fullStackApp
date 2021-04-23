import { HttpHeaders } from "@angular/common/http"

export class UserServiceSettings {

    rootUrl = 'http://localhost:8080/toDo'

    tokenUrl = this.rootUrl + '/token'
    loginUrl = this.rootUrl + '/login/'
    registerUrl = this.rootUrl + '/register/'
    logoutUrl = this.rootUrl + '/logout/'
  
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }
  
    acceptedTokenLength = 15
}