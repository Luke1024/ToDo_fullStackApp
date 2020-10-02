var serverAdress = "";

function newTaskButtonClicked() {
    document.getElementById("newCard").style.display = 'none';
    document.getElementById("cardEditMode").style.display = 'flex';
}

function cardCancelCLicked() {
    document.getElementById("newCard").style.display = 'flex';
    document.getElementById("cardEditMode").style.display = 'none';
}

function cardSaveClicked() {
    var name = document.getElementById("taskForm").elements[0].value;
    /*tasks.push(name);*/
    /*document.getElementById("cardEditMode").style.display = 'none';*/
    showCards();
}

function showCards(){
    showCard();
}

function showCard(){
    document.getElementById("savedDescription").innerHTML = 'random';
}
