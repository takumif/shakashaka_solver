/// <reference path="../typings/main.d.ts" />
/// <reference path="board.ts" />
/// <reference path="board_io.ts" />
/// <reference path="solver.ts" />

$(() => {
    drawBoard(initBoard(10, 10), $(".board"));
    bindSquares();    
    
    isValidBlock(Square.TriTL, Square.Dot, Square.Dot, Square.TriBL);    
});