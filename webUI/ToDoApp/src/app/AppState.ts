import { Card } from "./Card";

export interface AppState {
    connectionStatus:boolean
    serverMessages:string[]
    userToken:string
    cards:Card[]
}