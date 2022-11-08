"use strict";
var singleplayer_btn,multiplayer_btn,homepage,gamepage,
singleplayer_optns,multiplayer_optns,playNow,singleplayerName,
player= new Object,opponent,multiplayer1Name,multiplayer2Name,
player1Name,player2Name,gamestatus;

singleplayer_btn=document.getElementById("single-player");
multiplayer_btn=document.getElementById("multi-player");
singleplayer_optns=document.getElementById("singleplayer-options");
multiplayer_optns=document.getElementById("multiplayer-options");
homepage=document.getElementById("homepage");
gamepage=document.getElementById("gamepage");
singleplayerName=document.getElementById("player-name");
multiplayer1Name=document.getElementById("player1-name");
multiplayer2Name=document.getElementById("player2-name");
playNow=document.getElementById("playNow");
player1Name=document.getElementById("player1-Name");
player2Name=document.getElementById("player2-Name");

singleplayer_btn.addEventListener('click',function(e){
    switchHide(singleplayer_optns,multiplayer_optns);
    switchActive(multiplayer_btn,singleplayer_btn);
    playNow.classList.remove("hide");
    opponent="computer";
});
multiplayer_btn.addEventListener('click',function(e){
    switchHide(multiplayer_optns,singleplayer_optns);
    switchActive(singleplayer_btn,multiplayer_btn);
    playNow.classList.remove("hide");
    opponent="human";
});
singleplayerName.addEventListener('input',function(){
    player.man=singleplayerName.value;
});
multiplayer1Name.addEventListener('input',function(){
    player.man=multiplayer1Name.value;
});
multiplayer2Name.addEventListener('input',function(){
    player.friend=multiplayer2Name.value;
});
playNow.addEventListener('click',function(){
    if(player.man==undefined || player.man==""){
        alert("Enter Your Name");
        return;
    }
    player1Name.textContent=player.man;
    if(opponent=="computer"){
        player2Name.textContent="AI";
    }
    if(opponent=="human"){
        if(player.friend==undefined|| player.friend==""){
            alert("Enter Opponent Name");
            return;
        }
        if(player.man==player.friend){
            alert("Enter different names");
            return;
        }
        player2Name.textContent=player.friend;
    }
   singleplayer_btn.classList.remove("activeOption");
   multiplayer_btn.classList.remove("activeOption");
   singleplayer_optns.classList.add("hide");
   multiplayer_optns.classList.add("hide");
   player.man="";
   player.friend="";
   document.getElementById("game-status").textContent=document.getElementById("player1-Name").textContent + "'s turn";
   playNow.classList.add("hide");
    switchHide(gamepage,homepage);
});
function switchHide(off,on){
    off.classList.remove("hide");
    on.classList.add("hide");
}
function switchActive(off,on){
    off.classList.remove("activeOption");
    on.classList.add("activeOption");
}