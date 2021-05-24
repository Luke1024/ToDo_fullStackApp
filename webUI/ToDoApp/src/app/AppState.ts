import { Card } from "./Card";
import { FormPanel } from "./form-panel";
import { FormPanelMode } from "./form-panel-mode";
import { ServerMessage } from "./server-message";
import { ServerManagement } from "./ServerManagement";
import { TaskListStatus } from "./task-list-status";
import { TopBar } from "./top-bar";

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