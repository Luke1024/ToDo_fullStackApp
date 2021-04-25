import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { pushCardToServer } from "./store-actions";
import { DeleteService } from "./task_service/delete.service";
import { SaveService } from "./task_service/save.service";
import { UpdateService } from "./task_service/update.service";

@Injectable()
export class Effects {
    constructor(
        private actions$:Actions,
        private deleteService:DeleteService,
        private saveService:SaveService,
        private updateService:UpdateService
    ) {}

    createCard$ = createEffect(() => this.actions$.pipe(ofType(pushCardToServer), this.saveService.saveTask())
    
}