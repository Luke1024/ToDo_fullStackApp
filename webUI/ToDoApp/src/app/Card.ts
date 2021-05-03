import { Task } from "./Task";

export interface Card {
    id: number;
    taskName: string;
    description: string;
    done: boolean;
    message:string
    messageShow:boolean
    editMode:boolean
    folded:boolean
}