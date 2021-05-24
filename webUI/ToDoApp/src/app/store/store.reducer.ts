import { Action, createReducer, createReducerFactory, on, State, Store } from '@ngrx/store'
import { Task } from '../models/task'
import { AppState } from './AppState'
import { createCard,
     updateCard,
      deleteCard,
         setTopBarMessage,
setFormPanelMode,
setToken,
setUserLoggedToFalse,
setUserLoggedToTrue,
addServerMessage,
createMultipleCards,
changeTaskListStatus
} from './store-actions'
import { Card } from '../models/card'
import { FormPanelMode } from '../models/form-panel-mode'
import { ServerMessage } from '../models/server-message'
import { TaskListStatus } from '../models/task-list-status'

export const initialState:AppState = {
    topBarMessage:"ToDo App",
    formPanelMode:FormPanelMode.NOT_VISIBLE,
    token:"",
    userLogged:false,
    serverMessages:[],
    taskListStatus: TaskListStatus.ALL,
    cards:[]}

const _appReducer = createReducer(
    initialState,
    //TopBar actions
    on(setTopBarMessage, (state,{message}) => ({...state, topBarMessage:message})),
    on(setFormPanelMode, (state,{mode}) => ({...state, formPanelMode:mode})),
    on(setToken, (state,{token}) => ({...state, token:token})),
    on(setUserLoggedToTrue, state => ({...state, userLogged:true})),
    on(setUserLoggedToFalse, state => ({...state, userLogged:false})),
    on(addServerMessage, (state,{message}) => ({...state, serverMessages:messageAdder(state,message)})),
    on(changeTaskListStatus, (state,{taskListStatus}) => ({...state, taskListStatus:taskListStatus})),

    on(createMultipleCards, (state, {cards}) => ({...state, cards:cards})),
    on(createCard, (state, {card}) => ({...state, cards:cardCreator(state,card)})),
    on(updateCard, (state, {card}) => ({...state, cards:cardUpdater(state,card)})),
    on(deleteCard, (state, {card
    }) => ({...state, cards:state.cards.filter(c => c.id !== card.id)}))
)

export function appReducer(state: AppState | undefined, action: Action){
    return _appReducer(state,action)
}

var messageAdder = function(state:AppState, message:ServerMessage):ServerMessage[] {
    var messages = state.serverMessages.slice()
    messages.push(message)
    return messages
}

var cardCreator = function(state:AppState, card:Card):Card[] {
    var cards = state.cards.slice()
    cards.push(card)
    return cards
}

var cardUpdater = function(state:AppState, card:Card):Card[] {
    var cards = state.cards.slice()
    for(var i=0; i<cards.length; i++){
        if(cards[i].id == card.id){
            cards[i]=card
        }
    }
    return cards
}
