import { Card } from "./Card";
import { FormPanel } from "./form-panel";
import { FormPanelMode } from "./form-panel-mode";
import { ServerMessage } from "./server-message";
import { ServerManagement } from "./ServerManagement";
import { TopBar } from "./top-bar";

export interface AppState {

    //TopBar
    topBarDisableButtons:boolean
    topBarMessage:string

    //FormPanel
    formPanelVisible:boolean
    formPanelMode: FormPanelMode
    formPanelMessage: string

    //ServerManagement
    connected:boolean
    token:string
    userLogged:boolean
    serverMessages:ServerMessage[]

    cards:Card[]
}