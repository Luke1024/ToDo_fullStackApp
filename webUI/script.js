let app = angular.module("todo", []);
app.controller("cardController", function($scope){
    $scope.cards = [{name:"task1", description:"task1 description"},
    {name:"task2", description:"task2 description"}];
});
/*
$(document).ready(function(){

  const toDoApiRoot = "http://localhost:8080/toDo/";
  const tasksEndpoint = "tasks";
  const tokenEndpoint = "token";

  let token;

  

  console.log("execution");
  loadLayout();

  function loadLayout(){
    CardViewController.loadCardTemplate();
    getTokenFromServer();
  }



  function getTokenFromServer(){
    console.log('send execution');
    let requestUrl = toDoApiRoot + tokenEndpoint; 

    $.get(requestUrl, function(data, status){
      if(status=='success'){
        token = data;
        console.log("token set: " + token);
        console.log(data + " " + status);
      }
    });
  }

  function loadCardObjectsToGlobalVariables(button){
    card = button.parents('[card]');

    buttonAreaInvisible = card.find('[button-area-invisible]');

    visibleInCompactMode = card.find('[visible-in-compact-mode]');
    taskNameParagraph = card.find('[task-name-paragraph]');
    buttonCardMark = card.find('[button-card-mark]');
    buttonCardRemove = card.find('[button-card-remove]');
    buttonCardRemoveSecondary = card.find('[button-card-remove-secondary]');
    removeMenu = card.find('[remove-menu]');

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
    blankWarning = card.find('[blank-warning]');
  }

  function processToSavedMode() {
    taskNameForm.fadeOut(200);
    taskDescriptionForm.fadeOut(200);
    taskNameParagraph.removeClass("hidden");
    taskDescriptionParagraph.removeClass("hidden");

    buttonCardUpdate.addClass("hidden");
    buttonCardAbort.addClass("hidden");

    buttonCardEdit.removeClass("hidden");
    buttonCardFold.removeClass("hidden");

    buttonCardMark.fadeIn(200);
    buttonCardRemove.fadeIn(200);

    visibleInExpandedMode.fadeOut(200);
    card.delay(200).animate({height:'30px'});
    buttonAreaInvisible.removeClass("hidden");
  }

  function cardRemove(){
    loadCardObjectsToGlobalVariables($(this));
    card.remove();
  }

  function cardUpdate(){
    loadCardObjectsToGlobalVariables($(this));
    if(taskNameForm.val().length>0){
      taskNameParagraph.text(taskNameForm.val());
      taskDescriptionParagraph.text(taskDescriptionForm.val());
      processToSavedMode();
      sendDataToServer();
    } else {
      informAboutBlankName();
    }
  }

  function sendDataToServer(){
    console.log('send execution');
    let requestUrl = toDoApiRoot + tasksEndpoint; 

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        task: taskNameParagraph.text(),
        description: taskDescriptionParagraph.text(),
      })
    });
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

    buttonCardEdit.addClass("hidden");
    buttonCardUpdate.removeClass("hidden");
    buttonCardFold.addClass("hidden");
    buttonCardAbort.removeClass("hidden");

    taskNameParagraph.addClass("hidden");
    taskDescriptionParagraph.addClass("hidden");
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
    
    if(taskNameForm.val().length>0){
      processWithCardSaving();
      sendDataToServer();
    } else {
      informAboutBlankName();
    }
  }

  function processWithCardSaving(){
    taskNameParagraph.text(taskNameForm.val());
    taskDescriptionParagraph.text(taskDescriptionForm.val());

    buttonCardSave.addClass("hidden");
    buttonCardEdit.removeClass("hidden");
    buttonCardCancel.addClass("hidden");
    buttonCardFold.removeClass("hidden");
    buttonCardMark.removeClass("hidden");

    taskNameForm.fadeOut(200);
    taskDescriptionForm.fadeOut(400);
    taskNameParagraph.removeClass("hidden");
    taskDescriptionParagraph.removeClass("hidden");

    visibleInExpandedMode.delay(400).fadeOut(200);
    card.delay(600).animate({height:'30px'});

    buttonAreaInvisible.css({"width":"91%"});
    buttonAreaInvisible.removeClass("hidden");
    addAuthorizationToCardRemoving();
  }

  function addAuthorizationToCardRemoving(){
    buttonCardRemove.addClass("hidden");
    buttonCardRemoveSecondary.removeClass("hidden");    
  }

  function toggleRemoveMenu() {
    removeMenu.fadeToggle(200);
  }

  function informAboutBlankName(){
    blankWarning.fadeIn(200).delay(500).fadeOut(2000);
  }

  function markDone(){
    loadCardObjectsToGlobalVariables($(this));
    card.appendTo(doneParagraph);
    card.css({"background-color":"green"});
    if(card.css("height")=='100px'){
      visibleInExpandedMode.fadeOut(200);
      card.delay(200).animate({height:'30px'});
      buttonAreaInvisible.removeClass("hidden");
      buttonCardMark.addClass('hidden');
    }
  }

  function expandCard(){
    loadCardObjectsToGlobalVariables($(this));
    buttonAreaInvisible.addClass("hidden");
    card.animate({height:'100px'}, 200)
    visibleInExpandedMode.delay(200).fadeIn(200);
  }

  appContainer.on('click', '[button-card-mark]', markDone);
  appContainer.on('click', '[button-card-remove]', cardRemove);
  appContainer.on('click', '[button-card-remove-secondary]', toggleRemoveMenu)
  appContainer.on('click', '[authorize-remove]', cardRemove);
  appContainer.on('click', '[cancel-remove]', toggleRemoveMenu);
  appContainer.on('click', '[button-card-update]', cardUpdate);
  appContainer.on('click', '[button-card-abort]', cardAbort);
  appContainer.on('click', '[button-card-edit]', cardEdit);
  appContainer.on('click', '[button-card-cancel]', cardCancelFold);
  appContainer.on('click', '[button-card-save]', saveCard);
  appContainer.on('click', '[button-card-fold]', cardCancelFold);
  appContainer.on('click', '[button-area-invisible]', expandCard);
  appContainer.on('click', '[button-card-new]', CardViewController.loadCardTemplate());
});
*/
