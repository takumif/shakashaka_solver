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
    //var board = randomBoard(2);
    
    var board:Square[][] = [[1,8,9,7,2], [7,10,7,9,7], [8,9,10,7,9], [10,7,9,10,11], [4,10,11,7,1]];
    
    drawBoard(board, $(".board"));
        
    if (isSolved(board)){
        console.log("SOLVED!");
    } else {
        console.log("Something wrong.");
    }   
        
    // if (!checkBottomSide(board[1][0], board[1][1])){
    //     console.log("invalid side.");
    // }
    
    //isValidBlock(board[0][0], board[0][1], board[1][0], board[1][1]);
    //isValidBlock(8, 10, 9, 7);    
    //runSingleBlockCases();
});