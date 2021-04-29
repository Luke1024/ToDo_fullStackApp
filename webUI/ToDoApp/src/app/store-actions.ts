import { createAction, props } from '@ngrx/store'
import { Card } from './Card'
import { FormPanelMode } from './form-panel-mode'
import { ServerMessage } from './server-message'

//TopBar component actions
export const setDisableButtonsToTrue = createAction("[TopBar Component] Set disableButtons to true. ")
export const setDisableButtonsToFalse = createAction("[TopBar Component] Set disableButtons to false.")
export const setTopBarMessage = createAction(
    "[TopBar Component] Set message.",
    props<{message:string}>())

//FormPanel component actions
export const setFormPanelVisibleToTrue = createAction("[FormPanel Component] Set visible to true.")
export const setFormPanelVisibleToFalse = createAction("[FormPanel Component] Set visible to false.")
export const setFormPanelMode = createAction(
    "[FormPanel Component] Set mode.",
    props<{mode:FormPanelMode}>())
export const setFormPanelMessage = createAction(
    "[FormPanel Component] Set message.",
    props<{message:string}>())

//ServerManagement actions
export const setConnectedToTrue = createAction("[ServerManagement] Set connected to true.")
export const setConnectedToFalse = createAction("[ServerManagement] Set connected to false.")
export const setToken = createAction("[ServerManagement] Set token.",
    props<{token:string}>())
export const setUserLoggedToTrue = createAction("[ServerManagement] Set user logged to true.")
export const setUserLoggedToFalse = createAction("[ServerManagement] Set user logged to false.")
export const addServerMessage = createAction("[ServerManagement] Add message.",
    props<{message:ServerMessage}>())

export const createMultipleCards = createAction(
    '[Tasks Component] Create multiple cards',
    props<{cards:Card[]}>())

export const createCard = createAction(
    '[Tasks Component] CreateCard',
    props<{card:Card}>())

export const updateCard = createAction(
    '[Tasks Component] UpdateCard',
    props<{card:Card}>())
export const deleteCard = createAction(
    '[Tasks Component] DeleteCard',
    props<{card:Card}>())


