import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
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

  getToken(): Observable<HttpResponse<StringDto>> {
    return this.http.get<StringDto>(this.tokenUrl, {observe:'response'})
    //.pipe(catchError(this.handleError<HttpResponse>()))
  }

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
}
