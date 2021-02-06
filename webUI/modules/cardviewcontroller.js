let appContainer = $("[app-container]");
let cardContainer = $("[card-container]");
let cardTemplate = $("[card-area-template]");
let doneParagraph = $("[done-card-container]");

//new button
let newButton = $("[button-card-new]");

//card variables
let card;
let buttonAreaInvisible;

let visibleInCompactMode;
let taskNameParagraph;
let buttonCardMark;
let buttonCardRemove;
let buttonCardRemoveSecondary;
let removeMenu;

let visibleInExpandedMode;
let taskNameForm;
let taskDescriptionForm;
let taskDescriptionParagraph;

let buttonCardSave;
let buttonCardEdit;
let buttonCardUpdate;
let buttonCardAbort;
let buttonCardFold;
let buttonCardCancel;
let blankWarning;


class CardViewController {
    
    loadCardTemplate(){
        let template = cardTemplate.children('[card]');
        let newCard = template.clone();
        newCard.appendTo(cardContainer);
    }
}



export { CardViewController };