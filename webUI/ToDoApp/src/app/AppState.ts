import { Card } from "./Card";
import { FormPanel } from "./form-panel";
import { ServerManagement } from "./ServerManagement";
import { TopBar } from "./top-bar";

export interface AppState {
    topBar:TopBar
    formPanel:FormPanel
    serverManagement:ServerManagement
    cards:Card[]
}