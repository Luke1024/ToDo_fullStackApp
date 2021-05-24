import { createAction, props } from '@ngrx/store'
import { Card } from './Card'
import { FormPanelMode } from './form-panel-mode'
import { ServerMessage } from './server-message'
import { TaskListStatus } from './task-list-status'

//TopBar component actions
export const setTopBarMessage = createAction(
    "[TopBar Component] Set message.",
    props<{message:string}>())

//FormPanel component actions
export const setFormPanelMode = createAction(
    "[FormPanel Component] Set mode.",
    props<{mode:FormPanelMode}>())

//ServerManagement actions
export const setToken = createAction("[ServerManagement] Set token.",
    props<{token:string}>())
export const setUserLoggedToTrue = createAction("[ServerManagement] Set user logged to true.")
export const setUserLoggedToFalse = createAction("[ServerManagement] Set user logged to false.")
export const addServerMessage = createAction("[ServerManagement] Add message.",
    props<{message:ServerMessage}>())

export const changeTaskListStatus = createAction(
    "[Task Component] Change task list status.",
    props<{taskListStatus:TaskListStatus}>())

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


