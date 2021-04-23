import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { StringDto } from './StringDto';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserCredentials } from './UserCredentials';
import { AppState } from './AppState';
import { Store } from '@ngrx/store';
import { setToken } from './store-actions';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private rootUrl = 'http://localhost:8080/toDo'

  private tokenUrl = this.rootUrl + '/token'
  private loginUrl = this.rootUrl + '/login/'
  private registerUrl = this.rootUrl + '/register/'
  private logoutUrl = this.rootUrl + '/logout/'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  acceptedTokenLength = 15

  token:string = ""
  userLogged:boolean = false

  

  appState$:Observable<any>

  constructor(private http:HttpClient, private store:Store<{appState:AppState}>) {
    this.appState$ = store.select('appState')
    this.appState$.subscribe(app => this.setState(app))
    this.getToken()
  }

  //token setting
  private setState(state:AppState):void {
    this.token = state.token
    this.userLogged = this.userLogged
  }

  private getToken(): void {
    this.addServerManagementMessage("Connecting to server...", true, 0)
    this.http.get<StringDto>(this.tokenUrl, {observe:'response'}).subscribe(token => this.setToken(token))
    //.pipe(catchError(this.handleError<HttpResponse>()))
  }

  private setToken(response:HttpResponse<StringDto>):void {
    var status:number = response.status

    if(status==200){
      if(response.body?.value != null){
        if(this.checkTokenLength(response.body.value)){
          console.log('Token received: ' + this.token)
          this.addServerManagementMessage("Connected", true,0)
          this.store.dispatch(setToken({token:response.body.value}))
          return
        }
      }
    }
    this.addServerManagementMessage("Server not responding.",false,0)
  }

  private checkTokenLength(token:string):boolean {
    if(token!=null){
      if(token.length==this.acceptedTokenLength) {
        return true
      }
    }
    return false
  }

  //user login

  login(token:String, userCredentials:UserCredentials): Observable<HttpResponse<StringDto>> {
    return this.http.post<StringDto>(
      this.loginUrl + token, userCredentials, {observe: 'response'})
  }

  register(token:String, userCredentials:UserCredentials): Observable<HttpResponse<StringDto>> {
    return this.http.post<StringDto>(
      this.registerUrl + token, userCredentials, {observe: 'response'})
  }

  logout(token:String): Observable<HttpResponse<StringDto>> {
    return this.http.get<StringDto>(this.loginUrl + token, {observe:'response'})
  }

  private addServerManagementMessage(message:string, status:boolean, statusCode:number){
    var serverMessage:ServerMessage = {message:message, messageStatusCode:statusCode, messageStatus:status}
    this.store.dispatch(addServerManagementMessage({message:serverMessage}))
  }
}
