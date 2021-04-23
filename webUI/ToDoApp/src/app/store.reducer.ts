import { Action, createReducer, createReducerFactory, on, State, Store } from '@ngrx/store'
import { Task } from './Task'
import { AppState } from './AppState'
import { createCard,
     updateCard,
      deleteCard,
       setDisableButtonsToTrue,
        setDisableButtonsToFalse,
         setTopBarMessage,
        setFormPanelVisibleToTrue,
    setFormPanelVisibleToFalse,
setFormPanelMode,
setFormPanelMessage,
setConnectedToFalse,
setConnectedToTrue,
setToken,
setUserLoggedToFalse,
setUserLoggedToTrue,
addServerManagementMessage
} from './store-actions'
import { Card } from './Card'
import { FormPanelMode } from './form-panel-mode'
import { TopBar } from './top-bar'
import { ServerMessage } from './server-message'

export const initialState:AppState = {
    topBarDisableButtons:false,
    topBarMessage:"ToDo",
    formPanelVisible:false,
    formPanelMode:FormPanelMode.LOG_IN,
    formPanelMessage:"",
    token:"",
    userLogged:false,
    serverMessages:[],
    cards:[]}

const _appReducer = createReducer(
    initialState,
    //TopBar actions
    on(setDisableButtonsToTrue, state => ({...state, topBarDisableButtons:true})),
    on(setDisableButtonsToFalse, state => ({...state, topBarDisableButtons:false})),
    on(setTopBarMessage, (state,{message}) => ({...state, topBarMessage:message})),
    on(setFormPanelVisibleToTrue, state => ({...state, formPanelVisible:true})),
    on(setFormPanelVisibleToFalse, state => ({...state, formPanelVisible:false})),
    on(setFormPanelMode, (state,{mode}) => ({...state, formPanelMode:mode})),
    on(setFormPanelMessage, (state,{message}) => ({...state,formPanelMessage:message})),
    on(setToken, (state,{token}) => ({...state, token:token})),
    on(setUserLoggedToTrue, state => ({...state, userLogged:true})),
    on(setUserLoggedToFalse, state => ({...state, userLogged:false})),
    on(addServerManagementMessage, (state,{message}) => ({...state, serverMessages:messageAdder(state,message)})),
    
    on(createCard, (state, {card}) => ({...state, cards:cardCreator(state,card)})),
    on(updateCard, (state, {card}) => ({...state, cards:cardUpdater(state,card)})),
    on(deleteCard, (state, {card
    }) => ({...state, cards:state.cards.filter(c => c.frontId !== card.frontId)}))
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
        if(cards[i].frontId == card.frontId){
            cards[i]=card
        }
    }
    return cards
}
