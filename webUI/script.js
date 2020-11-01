$(document).ready(function(){

  let appContainer = $("[app-container]");
  let cardContainer = $("[card-container]");
  let cardTemplate = $("[card-area-template]");

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

  function unfoldCard(){
    let cardEdit = $(this).siblings('[card-edit-mode]');
    let cardFolded = cardEdit.siblings('[card-folded]');
    cardFolded.addClass("hidden");
    cardEdit.slideDown(100);
  }

  function saveCard(){
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
      loadCardTemplate();
      cardEdit.slideUp(100);
      cardFolded.removeClass('hidden');
    } else {
      description.val("");
      cardFolded.removeClass('hidden');
      cardEdit.slideUp(100);
    }
  }

  function switchToEditButton(button){
    button.addClass("hidden");
    button.siblings('[card-edit]').removeClass("hidden");
  }

  function switchToUpdateButton(button){
    button.addClass("hidden");
    button.siblings('[card-update]').removeClass("hidden");
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

  appContainer.on('click', '[card-cancel]', cardEditCancel);
  appContainer.on('click', '[card-save]', saveCard);
  appContainer.on('click', '[card-edit]', editCard);
  appContainer.on('click', '[card-update]', cardUpdate);
  appContainer.on('click', '[card-folded]', unfoldCard);
});
