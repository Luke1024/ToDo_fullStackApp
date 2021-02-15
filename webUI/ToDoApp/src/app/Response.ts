export class Response {
    status:boolean
    statusCode:number
    message:string

    constructor(status:boolean, statusCode:number, message:string){
        this.status=status
        this.statusCode=statusCode
        this.message=message
    }
}