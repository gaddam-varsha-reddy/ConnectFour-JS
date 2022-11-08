"use strict";
var board,rows=6,columns=7,gameover=false,coOrd,x,y,
vacantRow,colorPlacement,activeplayer=1,count,gamestatus,
modal,modalImg,modalText,modaltitle,opponent,playAgainBtn,exitGameBtn,
homepage,gamepage,totalPlayers=2,winnerimg,new_col,row,col,
valid_locations,best_score,best_col;

opponent=document.getElementById("player2-Name").textContent;
gamestatus=document.getElementById("game-status");
modal=document.getElementById("Modal");
modalImg=document.querySelector(".modal-img");
modalText=document.querySelector(".modal-text");
modaltitle=document.querySelector(".modal-title");
playAgainBtn=document.querySelector("#playAgain");
exitGameBtn=document.querySelector("#exitGame");
homepage=document.getElementById("homepage");
gamepage=document.getElementById("gamepage");

// addModalContent(3);
setGameBoard();
function setGameBoard(){
    board=[];
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            row.push(' ');
            let tile=document.createElement("div");
            tile.id=r.toString()+ '-'+ c.toString();
            tile.classList.add("tile");
            tile.addEventListener('click',function(e){
                onTileClick(e);
            });
            document.getElementById("board").appendChild(tile);
        }
        board.push(row);
    }
}
function is_validLocation(col){
    return board[0][col]==" ";
}
function GetVacantRow(col){
    for(let i=5;i>=0;i--){
        if(board[i][col]===" ")
            return i;
    }
}
function onTileClick(e){
    if(!gameover){
        coOrd=e.target.id.split("-");
        x=parseInt(coOrd[0]);
        y=parseInt(coOrd[1]);
        if(is_validLocation(y)){
            vacantRow=GetVacantRow(y);
            colorPlacement=document.getElementById(`${vacantRow}-${y}`);
            colorPlacement.classList.add(`player${activeplayer}Color`);
            if(activeplayer==1){
                board[vacantRow][y]="player-1";
                activeplayer=2;
                TurnIndication(activeplayer);
                if(opponent=="computer"){
                    computerTurn();
                    activeplayer=1;
                    TurnIndication(activeplayer);
                }
            }
            else{
                board[vacantRow][y]="player-2";
                activeplayer=1;
                TurnIndication(activeplayer);
            }
        }
        count=0;
        for(let i=0;i<rows;i++){
            for(let j=0;j<columns;j++){
                if(board[`${i}`][`${j}`]!=" "){
                    count+=1;
                }
            }
        }
        if(count>6){ 
            if(winningCheck("player-1"))
                addModalContent(1);
            else if(winningCheck("player-2"))
                addModalContent(2);
            else if(count==42)
                addModalContent(3);
        }
    }   
}

function get_valid_locations(){
	valid_locations = []
	for(col in range(columns)){
		if(is_validLocation(col))
			valid_locations.push(col);
    }
	return valid_locations;
}
function pick_best_move(piece){
    valid_locations =get_valid_locations();
    best_score=-10000;
    best_col =random.choice(valid_locations);
    for(col in valid_locations){
        row=GetVacantRow(col);
        temp_board=board.copy();
        drop_piece(temp_board,row,col,piece);
        score=score_position(temp_board,piece);
        if (score > best_score){
            best_score=score;
            best_col=col;
        }
    }
    return best_col;
}

function computerTurn(){
    //get new position, add in array,drop ball
    //new_col=pick_best_move("player-2");

}
function TurnIndication(activeplayer){
    gamestatus.textContent= document.getElementById(`player${activeplayer}-Name`).textContent + "'s turn";
}
playAgainBtn.addEventListener('click',function(){
    newGame();
});
exitGameBtn.addEventListener('click',function(){
   exitGame();
});
function exitGame(){
    backdrop.style.display = "none";
    modal.style.display = "none";
   newGame();
   switchHide(homepage,gamepage);
   document.getElementById("player-name").value="";
   for(let i=1;i<=totalPlayers;i++){
        updateName(i);
        updateScore(i);
   }
}
function switchHide(off,on){
    off.classList.remove("hide");
    on.classList.add("hide");
}
function updateScore(no){
    document.getElementById(`player${no}-score`).textContent=0;
}
function updateName(no){
    document.getElementById(`player${no}-name`).value="";
}
function newGame(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            board[i][j]=" ";
            document.getElementById(`${i}-${j}`).classList.remove("player1Color");
            document.getElementById(`${i}-${j}`).classList.remove("player2Color");
        }
    }
    activeplayer=1;
    TurnIndication(1);
    gameover=false;  
}
function winningCheck(player){
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns-3;j++){
            if(CheckingConditions(i,j,i,j+1,i,j+2,i,j+3,player))
                return true;
        }
    }
    for(let i=0;i<rows-3;i++){
        for(let j=0;j<columns;j++){
            if(CheckingConditions(i,j,i+1,j,i+2,j,i+3,j,player))
                return true;
        }
    }
    for(let i=3;i<rows;i++){
        for(let j=0;j<columns-3;j++){
            if(CheckingConditions(i,j,i-1,j+1,i-2,j+2,i-3,j+3,player))
                return true;
        }
    }
    for(let i=0;i<rows-3;i++){
        for(let j=0;j<columns-3;j++){
            if(CheckingConditions(i,j,i+1,j+1,i+2,j+2,i+3,j+3,player))
                return true;
        }
    }
}
function CheckingConditions(a1,b1,a2,b2,a3,b3,a4,b4,player){
    if(board[a1][b1]==player && board[a2][b2]==player
        && board[a3][b3]==player && board[a4][b4]==player){
            return true;
        }
}
function addModalContent(playerno){
    gameover=true;
    gamestatus.textContent="Game Over";
    winnerimg = document.createElement('img');
    modalImg.textContent="";
    winnerimg.height=100;
    if (playerno==1 || playerno==2){
        modalText.textContent=document.getElementById(`player${playerno}-Name`).textContent + " Won the Game";
         winnerimg.src = `images/avathar${playerno}.png`;
         modaltitle.textContent="Hurray!!";
         let playerscore=document.getElementById(`player${playerno}-score`);
         playerscore.textContent=parseInt(playerscore.textContent)+1;
    }
    else{
        winnerimg.src="images/gametie.jpg";
         modalText.textContent="It's a Draw";
         modaltitle.textContent="Oops!!";
    }
    modalImg.appendChild(winnerimg);
    setTimeout(openModal, 1000);
 }
 
 function openModal() {
     backdrop.style.display = "block";
     modal.style.display = "block";
     modal.style.position="sticky";
 }
 function closeModal() {
     newGame();
     winnerimg.src="";
     backdrop.style.display = "none";
     modal.style.display = "none";
 }
 window.onclick = function(event) {
     if (event.target == modal) {
       closeModal()
     }
   }
