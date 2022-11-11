"use strict";
var board,rows=6,columns=7,gameover=false,coOrd,x,y,
vacantRow,colorPlacement,activeplayer=1,count,gamestatus,
modal,modalImg,modalText,modaltitle,opponent,playAgainBtn,exitGameBtn,col_array,
homepage,gamepage,totalPlayers=2,winnerimg,new_col,row,col,opp_piece,count_Array,
valid_locations,best_score,best_col,score,temp_board,row_array,Window_Length=4,window_array=[];

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
                onTileClick(board,e);
            });
            document.getElementById("board").appendChild(tile);
        }
        board.push(row);
    }
}
function is_validLocation(board,col){
    return board[0][col]==" ";
}
function GetVacantRow(board,col){
    for(let i=5;i>=0;i--){
        if(board[i][col]===" ")
            return i;
    }
}
function onTileClick(board,e){
    if(!gameover){
        coOrd=e.target.id.split("-");
        x=parseInt(coOrd[0]);
        y=parseInt(coOrd[1]);
        if(is_validLocation(board,y)){
            if(activeplayer==1){
                activeplayer=drop_ball(board,y,activeplayer);
                if(opponent=="computer" && !gameover){
                    setTimeout(computerTurn,1500,board);
                }
            }
            else if(activeplayer==2 && opponent!="computer"){
                activeplayer= drop_ball(board,y,activeplayer);
            }
        }
    }   
}

function check_gameEnd(board){
    count=0;
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            if(board[`${i}`][`${j}`]!=" "){
                count+=1;
            }
        }
    }
    if(count>6){ 
        if(winningCheck(board,"player1"))
            addModalContent(1);
        else if(winningCheck(board,"player2"))
            addModalContent(2);
        else if(count==42)
            addModalContent(3);
    }
}
function get_valid_locations(board){
	valid_locations = []
	for(col=0;col<columns;col++){
		if(is_validLocation(board,col)){
			valid_locations.push(col);
        }
    }
	return valid_locations;
}

function drop_piece(temp_board,row,col,piece){
    temp_board[row][col]=piece;
}

function evaluate_window(window_array,piece){
    score=0;
    opp_piece="player1";
    if(piece=="player1"){
        opp_piece="player2";
    }
    count_Array = {};
    window_array.forEach(element => {
        count_Array[element] = (count_Array[element] || 0) + 1;
    });
    if(count_Array[piece]==4){
        score+=100;
    }
    else if(count_Array[piece]==3 && count_Array[' ']==1){
        score+=10;
    }
    else if(count_Array[piece]==2 && count_Array[' ']==2){
        score+=5;
    }
    if(count_Array[opp_piece]==3 && count_Array[' ']==1){
        score-=80;
    }
    if(count_Array[opp_piece]==2 && count_Array[' ']==2){
        score=-10;
    }
    return score;
}
function score_position(temp_board,piece){
    score=0;
    let center_array=[];
    for(let i=0;i<rows;i++){
        center_array.push(temp_board[i][3]);
    }
    let center_count=0;
    
   center_array.forEach(element => {
    if (element === piece) {
      center_count += 1;
    }
  });

  score+=center_count;
  //*3-giving priority to center
    for(let r=0;r<rows;r++){
        row_array=[];
        for(let i=0;i<columns;i++){
            row_array.push(temp_board[r][i]);
        }
        for(let c=0;c<columns-3;c++){
            window_array=[];
            for(let i=0;i<Window_Length;i++){
                window_array.push(row_array[c+i]);
            }
                score+= evaluate_window(window_array, piece);
        }
    }
    for(let c=0;c<columns;c++){
         col_array=[];
         for(let i=0;i<rows;i++){
            col_array.push(temp_board[i][c]);
         }
        for(let r=0;r<rows-3;r++){
            window_array=[];
            for(let i=0;i<Window_Length;i++){
                window_array.push(col_array[r+i]);
            }
                score+= evaluate_window(window_array, piece);
            }
        }

    for(let r=0;r<rows-3;r++){
           for(let c=0;c<columns-3;c++){
               window_array=[];
               for(let i=0;i<Window_Length;i++){
                       window_array.push(temp_board[r+i][c+i]);
               }
                score+= evaluate_window(window_array, piece);
                  }
          }
    for(let r=0;r<rows-3;r++){
            for(let c=0;c<columns-3;c++){
                window_array=[];
                for(let i=0;i<Window_Length;i++){
                        window_array.push(temp_board[r+3-i][c+i]);
                }
                score+= evaluate_window(window_array, piece);
               }
    } 
    return score;

}

function pick_best_move(board,piece){
    valid_locations =get_valid_locations(board);
    best_score=-1000;
    best_col =valid_locations[Math.floor(Math.random() * valid_locations.length)];
    for(col in valid_locations){
        row=GetVacantRow(board,valid_locations[col]);
        temp_board = JSON.parse(JSON.stringify(board));
        drop_piece(temp_board,row,valid_locations[col],piece);
        score=score_position(temp_board,piece);
        if (score > best_score){
            best_score=score;
            best_col=valid_locations[col];
        }
    }
    return best_col;
}

function drop_ball(board,col,activeplayer){
    vacantRow=GetVacantRow(board,col);
    colorPlacement=document.getElementById(`${vacantRow}-${col}`);
    colorPlacement.classList.add(`player${activeplayer}Color`);
    board[vacantRow][col]=`player${activeplayer}`;
    check_gameEnd(board);
    activeplayer=(activeplayer==1)? 2:1;
    TurnIndication(activeplayer);
    return activeplayer;
}
function computerTurn(board){
    new_col=pick_best_move(board,"player2");
    if(is_validLocation(board,new_col)){     
        activeplayer=drop_ball(board,new_col,activeplayer);
    }
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
function removeColors(i,j,no){
    document.getElementById(`${i}-${j}`).classList.remove(`player${no}Color`);
}
function newGame(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            board[i][j]=" ";
            for(let playerno=1;playerno<=totalPlayers;playerno++){
                removeColors(i,j,playerno);
            }
        }
    }
    activeplayer=1;
    TurnIndication(activeplayer);
    gameover=false;  
}
function winningCheck(board,player){
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns-3;j++){
            if(CheckingConditions(board,i,j,i,j+1,i,j+2,i,j+3,player))
                return true;
        }
    }
    for(let i=0;i<rows-3;i++){
        for(let j=0;j<columns;j++){
            if(CheckingConditions(board,i,j,i+1,j,i+2,j,i+3,j,player))
                return true;
        }
    }
    for(let i=3;i<rows;i++){
        for(let j=0;j<columns-3;j++){
            if(CheckingConditions(board,i,j,i-1,j+1,i-2,j+2,i-3,j+3,player))
                return true;
        }
    }
    for(let i=0;i<rows-3;i++){
        for(let j=0;j<columns-3;j++){
            if(CheckingConditions(board,i,j,i+1,j+1,i+2,j+2,i+3,j+3,player))
                return true;
        }
    }
}
function CheckingConditions(board,a1,b1,a2,b2,a3,b3,a4,b4,player){
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
