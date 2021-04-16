import { FormPanelMode } from "./form-panel-mode";

export interface FormPanel {
    visible:boolean
    mode: FormPanelMode
    message: string
}