import { Card } from "../models/card";
import { FormPanelMode } from "../models/form-panel-mode";
import { ServerMessage } from "../models/server-message";
import { TaskListStatus } from "../models/task-list-status";

export interface AppState {

    //TopBar
    topBarMessage:string

    //FormPanel
    formPanelMode: FormPanelMode

    //ServerManagement
    token:string
    userLogged:boolean
    serverMessages:ServerMessage[]

    taskListStatus: TaskListStatus
    cards:Card[]
}