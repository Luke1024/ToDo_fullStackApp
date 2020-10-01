function onLoadFunction() {

}

function newTaskButtonClicked() {
    document.getElementById("newCard").style.display = 'none';
    let response = document.getElementById("cardEditMode").style.display = 'flex';
    document.getElementById("toDoP").innerHTML = response;
}

function cardCancelCLicked() {
    document.getElementById("newCard").style.display = 'flex';
    document.getElementById("cardEditMode").style.display = 'none';
}