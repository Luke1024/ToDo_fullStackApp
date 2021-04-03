import { Task } from "./Task";

export interface AppState {
    connectionStatus:boolean
    serverMessages:string[]
    userToken:string
    tasks:Task[]
}