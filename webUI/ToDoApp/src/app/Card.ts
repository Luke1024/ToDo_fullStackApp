import { Task } from "./Task";

export interface Card {
    task:Task
    message:string
    messageShow:boolean
    folded:boolean
}