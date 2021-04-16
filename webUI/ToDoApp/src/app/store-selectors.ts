import { createSelector, props } from "@ngrx/store";
import { AppState } from "./AppState";

export const selectCards = (state: AppState) => state.cards

/*
export const selectCardsByStatus = createSelector(
    selectCards,
    (cards, props) => {
        if(cards.)
    }
)
*/