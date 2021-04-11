import { Action, createReducer, on, State, Store } from '@ngrx/store'
import { Task } from './Task'
import { AppState } from './AppState'
import { setStatusToFalse, setStatusToTrue, addServerMessage,
     setUserToken, createTask,
     updateTask, deleteTask } from './store-actions'


export const initialState:AppState = {
    connectionStatus:false,
    serverMessages:[], 
    userToken:'',
    tasks:[]}

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
    on(createTask, (state, { task
    }) => ({...state,tasks:state.tasks.concat(task)})),
    on(updateTask, (state, {task
    }) => ({...state, tasks:updater(state,task)})),
    on(deleteTask, (state, {task
    }) => ({...state, tasks:state.tasks.filter(t => t.frontId !== task.frontId)}))
)

export function appReducer(state: AppState | undefined, action: Action){
    return _appReducer(state,action)
}

var updater = function(state:AppState, task:Task):Task[] {
    var newTasks = state.tasks.slice()
    for(var i=0; i<newTasks.length; i++){
        if(newTasks[i].frontId==task.frontId){
            newTasks[i]=task
        }
    }
    return newTasks
}
