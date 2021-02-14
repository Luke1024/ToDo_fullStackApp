import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StringDto } from './StringDto';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserCredentials } from './UserCredentials';


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

  constructor(private http:HttpClient) {}

  getToken(): Observable<StringDto> {
    return this.http.get<StringDto>(this.tokenUrl)
    .pipe(catchError(this.handleError<StringDto>()))
  }

  login(token:String, userCredentials:UserCredentials): Observable<StringDto> {
    return this.http.post<StringDto>(
      this.loginUrl + token, userCredentials, this.httpOptions)
      .pipe(catchError(this.handleError<StringDto>('login')))
  }

  register(token:String, userCredentials:UserCredentials): Observable<StringDto> {
    return this.http.post<StringDto>(
      this.registerUrl + token, userCredentials, this.httpOptions)
      .pipe(catchError(this.handleError<StringDto>('register')))
  }

  logout(token:String): Observable<StringDto> {
    return this.http.get<StringDto>(this.loginUrl + token)
    .pipe(catchError(this.handleError<StringDto>('register')))
  }

  private handleError<StringDto>(operation = 'operation') {
    return (error: StringDto): Observable<StringDto> => {
      var message = { value: "someString" }

      message.value = "${" + operation + "} failed: ${" + error + "}"
      return of(message as unknown as StringDto)
    }
  }
}
