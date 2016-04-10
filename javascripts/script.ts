/// <reference path="../typings/main.d.ts" />
/// <reference path="board.ts" />
/// <reference path="board_io.ts" />
/// <reference path="solver.ts" />

// Test case for single portion.
function runSingleBlockCases(): void{
    //Math.floor(Math.random() * 6) + 1;  
    
    for (var i = 0; i < 10 ; i++){
        // An integer from 1 to 11.
        var tl = Math.floor(Math.random() * 6) + 6;
        var tr = Math.floor(Math.random() * 6) + 6;
        var bl = Math.floor(Math.random() * 6) + 6;
        var br = Math.floor(Math.random() * 6) + 6;
        var result = isValidBlock(tl, tr, bl, br);
        console.log("(" + tl + ", " + tr + ", " + bl + ", " + br + ")");
    }
}


$(() => {
    //drawBoard(initBoard(10, 10), $(".board"));
    //bindSquares();    
    var board = randomBoard(2);
    drawBoard(board, $(".board"));
        
    if (!checkRightSide(board[0][1], board[1][1])){
        console.log("invalid left side.");
    }
    
    //isValidBlock(board[0][0], board[0][1], board[1][0], board[1][1]);
    //isValidBlock(8, 10, 9, 7);    
    //runSingleBlockCases();
});