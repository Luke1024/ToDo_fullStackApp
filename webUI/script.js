$(document).ready(function(){

  let appContainer = $("[app-container]");
  let cardContainer = $("[card-container]");
  let cardTemplate = $("[card-area-template]");

  console.log("execution");
  loadLayout();

  function loadLayout(){
    let template = cardTemplate.children('[card]');
    let newCard = template.clone();
    newCard.children("[new-card]").removeClass('hidden');
    newCard.appendTo(cardContainer);
  }

  function cardEditModeToggle(){
    let newCard = $(this).parents('[new-card]');
    let cardEdit = newCard.siblings('[card-edit-mode]');
    cardEdit.slideToggle(500);
  }

  function saveCard(){
    let cardEdit = $(this).parents('[card-edit-mode]');
    let form = $(this).siblings('[task-form]');
    let name = form.children('[task-name]');
    let description = form.children('[task-description]');
    let nameContent = $(this).siblings('[task-name-content]');
    let descriptionContent = $(this).siblings('[task-description-content]');
    form.addClass('hidden');
    nameContent.text(name.val());
    descriptionContent.text(description.val());
    switchSaveToEditButton($(this));
  }

  function switchSaveToEditButton(button){
    button.addClass("hidden");
    button.siblings('[card-edit]').removeClass("hidden");
  }

  function switchEditToSaveButton(button){
    button.addClass("hidden");
    button.siblings('[card-save]').removeClass("hidden");
  }

  function cardEditCancel(){
    let cardEdit = $(this).parents('[card-edit-mode]');
    let form = $(this).siblings('[task-form]');
    let name = form.children('[task-name]');
    let description = form.children('[task-description]');
    name.val("");
    description.val("");
    cardEdit.slideUp();
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
    switchEditToSaveButton($(this));
  }

  appContainer.on('click', '[card-cancel]', cardEditCancel);
  appContainer.on('click', '[card-save]', saveCard);
  appContainer.on('click', '[card-edit]', editCard);
  appContainer.on('click', '[new-task-button]', cardEditModeToggle);
});
