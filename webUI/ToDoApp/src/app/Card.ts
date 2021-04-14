import { Task } from "./Task";

export interface Card {
    frontId: number;
    taskName: string;
    description: string;
    done: boolean;
    message:string
    messageShow:boolean
    folded:boolean
}