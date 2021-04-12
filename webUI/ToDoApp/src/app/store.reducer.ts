import { Action, createReducer, on, State, Store } from '@ngrx/store'
import { Task } from './Task'
import { AppState } from './AppState'
import { setStatusToFalse, setStatusToTrue, addServerMessage,
     setUserToken, createCard,
     updateCard, deleteCard } from './store-actions'
import { Card } from './Card'

export const initialState:AppState = {
    connectionStatus:false,
    serverMessages:[], 
    userToken:'',
    cards:[]}

const _appReducer = createReducer(
    initialState,
    on(setStatusToTrue, state => ({
        ...state, connectionStatus:true
    })),
    on(setStatusToFalse, state => ({
        ...state, connectionStatus:false
    })),
    on(addServerMessage, (state, { message
    }) => ({...state,serverMessages:state.serverMessages.concat(message)})),
    on(setUserToken, (state, { token
    }) => ({...state,userToken:token})),
    on(createCard, (state, { card
    }) => ({...state,cards:state.cards.concat(card)})),
    on(updateCard, (state, {card
    }) => ({...state, cards:updater(state,card)})),
    on(deleteCard, (state, {card
    }) => ({...state, cards:state.cards.filter(c => c.task.frontId !== card.task.frontId)}))
)

export function appReducer(state: AppState | undefined, action: Action){
    return _appReducer(state,action)
}

var updater = function(state:AppState, card:Card):Card[] {
    var cards = state.cards.slice()
    for(var i=0; i<cards.length; i++){
        if(cards[i].task.frontId == card.task.frontId){
            cards[i]=card
        }
    }
    return cards
}
