import { ServerMessage } from "./server-message";

export interface ServerManagement {
    connected:boolean
    token:string
    userLogged:boolean
    messages:ServerMessage[]
}