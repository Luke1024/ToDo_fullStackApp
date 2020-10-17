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

  function cardEditCancel(){
    let cardEdit = $(this).parents('[card-edit-mode]');
    cardEdit.slideUp();
  }

  appContainer.on('click', '[card-cancel]', cardEditCancel);
  appContainer.on('click', '[new-task-button]', cardEditModeToggle);
});
