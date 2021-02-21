import { Card } from "../Card"
import { Task } from "../Task"

export class CardFactory {
    generate(taskName:string, taskDescription:string,cards:Card[]):Card {
        var id = this.generateId(cards)
        var task = {frontId:id, name:taskName, description:taskDescription, done:false} as Task
        return {task:task, message:"", messageShow:false, messageStatus:true} as Card
    }

    generateFromTask(task:Task){
        return {task:task, message:"", messageShow:false, messageStatus:true} as Card
    }

    generateFromTasks(tasks:Task[]):Card[]{
        var cards:Card[] = []
        for(var i=0; i<tasks.length; i++){
            cards.push({task:tasks[i], message:"", messageShow:false, messageStatus:true} as Card)
        }
        return cards
    }

    private generateId(cards:Card[]):number {
        if(cards.length==0){
            return 1
        }
        let maxNum:number = 0
        for(let i=0; i<cards.length; i++){
          if(cards[i].task.frontId > maxNum){
            maxNum = cards[i].task.frontId
          }
        }
        return maxNum + 1
    }
}