import { createAction, props } from '@ngrx/store'
import { Task } from './Task'

export const setStatusToTrue = createAction('[Server Connection] SetStatusTo_True')
export const setStatusToFalse = createAction('[Server Connection] SetStatusTo_False')

export const addServerMessage = createAction(
    '[Server Connection] SetStatus',
    props<{message:string}>())
export const setUserToken = createAction(
    '[Server Connection] SetUserToken',
    props<{token:string}>())

export const createTask = createAction(
    '[Tasks Component] CreateTask',
    props<{task:Task}>())
export const updateTask = createAction(
    '[Tasks Component] UpdateTask',
    props<{task:Task}>())
export const deleteTask = createAction(
    '[Tasks Component] DeleteTask',
    props<{task:Task}>())


