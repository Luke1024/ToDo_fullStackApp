$(document).ready(function(){
  console.log("execution");

  let cardArea = $("#cardArea");




  function cardEditModeToggle(){
      let card = $('#cardEditMode');
      card.slideToggle(500);
      console.log(card);
  }

  cardArea.on('click', '#cardCancel', cardEditModeToggle);
  cardArea.on('click', '#newTaskButton', cardEditModeToggle);
});
