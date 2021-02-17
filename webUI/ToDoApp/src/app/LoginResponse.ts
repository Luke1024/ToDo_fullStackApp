import { HttpResponse, HttpResponseBase } from "@angular/common/http"
import { Task } from "./Task"

export class LoginResponse {
    status:boolean
    statusCode:number
    message:string
    tasksHttpResponse:HttpResponse<Task[]> | undefined

    constructor(status:boolean, statusCode:number, message:string, tasksHttpResponse?:HttpResponse<Task[]>){
        this.status=status
        this.statusCode=statusCode
        this.message=message
        this.tasksHttpResponse=tasksHttpResponse
    }
}