import { createAction, props } from '@ngrx/store'
import { Card } from './Card'

export const setStatusToTrue = createAction('[Server Connection] SetStatusTo_True')
export const setStatusToFalse = createAction('[Server Connection] SetStatusTo_False')

export const addServerMessage = createAction(
    '[Server Connection] SetStatus',
    props<{message:string}>())
export const setUserToken = createAction(
    '[Server Connection] SetUserToken',
    props<{token:string}>())

export const createCard = createAction(
    '[Tasks Component] CreateCard',
    props<{card:Card}>())
export const updateCard = createAction(
    '[Tasks Component] UpdateCard',
    props<{card:Card}>())
export const deleteCard = createAction(
    '[Tasks Component] DeleteCard',
    props<{card:Card}>())


