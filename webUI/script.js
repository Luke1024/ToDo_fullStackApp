let serverAdress = "";

function onLoadFunction() {
    getUserInfo();
}

function getUserInfo(){

}

function newTaskButtonClicked() {
    document.getElementById("newCard").style.display = 'none';
    document.getElementById("cardEditMode").style.display = 'flex';
}

function cardCancelCLicked() {
    document.getElementById("newCard").style.display = 'flex';
    document.getElementById("cardEditMode").style.display = 'none';
}

function cardSaveClicked() {

}