$(document).ready(function(){
  let appContainer = $("[app-container]");
  let cardContainer = $("[card-container]");
  let cardTemplate = $("[card-area-template]");

  //card variables
  let card;
  let buttonAreaInvisible;

  let visibleInCompactMode;
  let taskNameParagraph;
  let buttonCardMark;
  let buttonCardRemove;

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

  console.log("execution");
  loadLayout();

  function loadLayout(){
    loadCardTemplate();
  }

  function loadCardTemplate(){
    let template = cardTemplate.children('[card]');
    let newCard = template.clone();
    newCard.appendTo(cardContainer);
  }

  function loadCardObjectsToGlobalVariables(button){
    card = button.parents('[card]');

    buttonAreaInvisible = card.find('[button-area-invisible]');

    visibleInCompactMode = card.find('[visible-in-compact-mode]');
    taskNameParagraph = card.find('[task-name-paragraph]');
    buttonCardMark = card.find('[button-card-mark]');
    buttonCardRemove = card.find('[button-card-remove]');

    visibleInExpandedMode = card.find('[visible-in-expanded-mode]');
    taskNameForm = card.find('[task-name-form]');
    taskDescriptionForm = card.find('[task-description-form]');
    taskDescriptionParagraph = card.find('[task-description-paragraph]');

    buttonCardSave = card.find('[button-card-save]');
    buttonCardEdit = card.find('[button-card-edit]');
    buttonCardUpdate = card.find('[button-card-update]');
    buttonCardAbort = card.find('[button-card-abort]');
    buttonCardFold = card.find('[button-card-fold]');
    buttonCardCancel = card.find('[button-card-cancel]');
  }

  function processToSavedMode() {
    taskNameForm.fadeOut(200);
    taskDescriptionForm.fadeOut(200);

    buttonCardUpdate.addClass("hidden");
    buttonCardAbort.addClass("hidden");

    buttonCardEdit.removeClass("hidden");
    buttonCardAbort.removeClass("hidden");

    buttonCardMark.removeClass("hidden");
    buttonCardRemove.removeClass("hidden");

    visibleInExpandedMode.fadeOut(200);
    card.delay(200).animate({height:'30px'});
    buttonAreaInvisible.removeClass("hidden");
  }

  function cardUpdate(){
    loadCardObjectsToGlobalVariables($(this));
    taskNameParagraph.text(taskNameForm.val());
    taskDescriptionParagraph.text(taskDescriptionForm.val());
    processToSavedMode();
  }

  function cardAbort(){
    loadCardObjectsToGlobalVariables($(this));
    taskNameForm.val('');
    taskDescriptionForm.val('');
    processToSavedMode();
  }

  function cardEdit(){
    loadCardObjectsToGlobalVariables($(this));
    buttonCardMark.fadeOut(200);
    buttonCardRemove.fadeOut(200);

    buttonCardEdit.addClass("hidden");
    buttonCardUpdate.removeClass("hidden");
    buttonCardFold.addClass("hidden");
    buttonCardAbort.removeClass("hidden");


    taskNameForm.fadeIn(200);
    taskDescriptionForm.fadeIn(200);

    taskNameForm.val(taskNameParagraph.text());
    taskDescriptionForm.val(taskDescriptionParagraph.text());
  }

  function cardCancelFold(){
    loadCardObjectsToGlobalVariables($(this));
    visibleInExpandedMode.fadeOut(200);
    card.delay(200).animate({height:'30px'});
    buttonAreaInvisible.removeClass("hidden");
  }

  function saveCard(){
    loadCardObjectsToGlobalVariables($(this));

    taskNameParagraph.text(taskNameForm.val());
    taskDescriptionParagraph.text(taskDescriptionForm.val());

    buttonCardSave.addClass("hidden");
    buttonCardEdit.removeClass("hidden");
    buttonCardCancel.addClass("hidden");
    buttonCardFold.removeClass("hidden");
    buttonCardMark.removeClass("hidden");
    buttonCardRemove.removeClass("hidden");

    taskNameForm.fadeOut(200);
    taskDescriptionForm.fadeOut(400);

    visibleInExpandedMode.delay(400).fadeOut(200);
    card.delay(600).animate({height:'30px'});

    buttonAreaInvisible.removeClass("hidden");
  }

  function expandCard(){
    loadCardObjectsToGlobalVariables($(this));
    buttonAreaInvisible.addClass("hidden");
    card.animate({height:'100px'}, 200)
    visibleInExpandedMode.delay(200).fadeIn(200);
  }

  appContainer.on('click', '[button-card-update]', cardUpdate);
  appContainer.on('click', '[button-card-abort]', cardAbort);
  appContainer.on('click', '[button-card-edit]', cardEdit);
  appContainer.on('click', '[button-card-cancel]', cardCancelFold);
  appContainer.on('click', '[button-card-save]', saveCard);
  appContainer.on('click', '[button-card-fold]', cardCancelFold);
  appContainer.on('click', '[button-area-invisible]', expandCard);
});
