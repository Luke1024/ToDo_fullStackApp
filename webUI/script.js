$(document).ready(function(){
  let appContainer = $("[app-container]");
  let cardContainer = $("[card-container]");
  let cardTemplate = $("[card-area-template]");

  //card variables

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

  function cardEditCancel(){
    let card = $(this).parents('[card]');
    card.children('[visible-in-expanded-mode]').fadeOut(200);
    card.attr("card-mode", "folded-mode-blank");
    card.delay(200).animate({height:'30px'});
    card.children('[button-area-invisible]').removeClass("hidden");
  }

  function saveCard(){
    let card = $(this).parents('[card]');
    let form = card.children('[task-form]');
    let taskForm = form.children('[task-name-form]');
    let descriptionForm = form.children('[task-description-form]');
    let taskParagraph = card.children('[task-name-paragraph]');
    let taskDescription = card.children('[task-description-paragraph]');

    taskParagraph.text(taskForm);

    //form.fadeOut(200);
    //card.children('[visible-in-expanded-mode]').delay(200).fadeOut(200);
    //card.delay(400).animate({height:'30px'});
    //card.children('[button-area-invisible]').removeClass("hidden");
  }

  function expandCard(){
    $(this).addClass("hidden");
    $(this).parents('[card]').animate({height:'100px'}, 200)
    .children('[visible-in-expanded-mode]').delay(200).fadeIn(200);
  }

  appContainer.on('click', '[button-card-cancel]', cardEditCancel);
  appContainer.on('click', '[button-card-save]', saveCard);
  appContainer.on('click', '[button-area-invisible]', expandCard);
});
