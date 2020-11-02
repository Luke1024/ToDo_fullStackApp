$(document).ready(function(){
  let appContainer = $("[app-container]");
  let cardContainer = $("[card-container]");
  let cardTemplate = $("[card-area-template]");

  //card variables
  let cardId;
  let cardMode; 
  let form;
  let nameForm;
  let descriptionForm;
  let paragraphs;
  let nameParagraph;
  let descriptionParagraph;
  let cardFolded;
  let buttonSave;
  let buttonEdit;
  let buttonUpdate;
  let buttonCancel;

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
/*
  function loadCardPartsToGlobalVariables(button){
    let card = button.parents('[card]');

    cardId = card.children('[card-id]');
    cardMode = card.children('[card-mode]'); 

    form = card.children('[task-form]');
    nameForm= card.children('[task-name-form]');
    descriptionForm = card.children('[task-description-form]');

    paragraphs = card.children('[paragraphs]');
    nameParagraph = card.children('[task-name-paragraph]');
    descriptionParagraph = card.children('[task-description-paragraph]');

    cardFolded = card.children('[card-folded]');

    buttonSave = card.children('[button-card-save]');
    buttonEdit = card.children('[button-card-edit]');
    buttonUpdate = card.children('[button-card-update]');
    buttonCancel = card.children('[button-card-cancel]');
  }

  function cardEditCancel(){
    let cardEdit = $(this).parents('[card-edit-mode]');
    let form = $(this).siblings('[task-form]');
    let name = form.children('[task-name]');
    let description = form.children('[task-description]');
    let cardFolded = cardEdit.siblings('[card-folded]');
    name.val("");
    description.val("");
    form.addClass('hidden');
    cardFolded.removeClass('hidden');
    cardEdit.slideUp(100);
  }

  function saveCard(){
    loadCardPartsToGlobalVariables($(this));
    if(nameForm.val().length > 1){
      loadTextFromFormToParagraph();
      cardFolded.children('[content]').text(nameForm.val());
      switchToSavedMode();
      loadCardTemplate();
      cardEdit.slideUp(100);
      cardFolded.removeClass('hidden');
    } else {
      descriptionForm.val("");
      cardFolded.removeClass('hidden');
      cardEdit.slideUp(100);
    }
  }

  function editCard(){
    let taskContent = $(this).siblings('[task-name-content]');
    let taskDescriptionContent = $(this).siblings('[task-description-content]');
    let form = $(this).siblings('[task-form]');
    let taskName = $(this).siblings('[task-name]');
    let taskDescription = $(this).siblings('[task-description]');
    taskName.val(taskContent.text());
    taskDescriptionContent.val(taskDescription.text());
    taskDescription.addClass("hidden");
    taskName.addClass("hidden");
    form.removeClass("hidden");
    switchToUpdateButton($(this));
  }

  function cardUpdate(){
    let cardEdit = $(this).parents('[card-edit-mode]');
    let form = $(this).siblings('[task-form]');
    let name = form.children('[task-name]');
    let description = form.children('[task-description]');
    let nameContent = $(this).siblings('[task-name-content]');
    let descriptionContent = $(this).siblings('[task-description-content]');
    let cardFolded = cardEdit.siblings('[card-folded]');
    if(name.val().length > 1){
      form.addClass('hidden');
      nameContent.text(name.val());
      descriptionContent.text(description.val());
      switchToEditButton($(this));
      cardFolded.children('[content]').text(name.val());
      cardEdit.slideUp(100);
      cardFolded.removeClass('hidden');
    } else {
      description.val("");
      cardFolded.removeClass('hidden');
      cardEdit.slideUp(100);
    }
  }
  */

  function expandCard(){
    $(this).animate({height:'100px'}, 100);
  }

  //appContainer.on('click', '[card-cancel]', cardEditCancel);
  //appContainer.on('click', '[button-card-save]', saveCard);
  //appContainer.on('click', '[button-card-edit]', editCard);
  //appContainer.on('click', '[button-card-update]', cardUpdate);
  appContainer.on('click', '[card]', expandCard);
});
