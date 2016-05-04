/// <reference path="../typings/main.d.ts" />
/// <reference path="board.ts" />
/// <reference path="board_io.ts" />
/// <reference path="solver.ts" />
/// <reference path="seq_solver.ts" />
/// <reference path="par_worker.ts" />


$(() => {

    var board = randomBoard(3);
    
    //board = [[1,8,9,7,2], [7,10,7,9,7], [8,9,10,7,9], [10,7,9,10,11], [4,10,11,7,1]];        
    //board = [[1,0,0,0,2], [0,0,10,0,7], [0,0,0,7,0], [10,0,9,0,0], [4,0,11,0,1]];    
    board = [[4,0,0,4],[0,0,0,0],[0,0,0,0],[4,0,0,4]];       
    board = [[3,0,1],[0,0,0],[0,0,3]];
           
    drawBoard(board, $(".board"));

    $("#run_solver").on("click", function(evt){
      evt.preventDefault(); // Prevent browser from refreshing on click.
      console.log("click");
      var start = new Date().getTime();
      var outputBoard = seqSolve(board);    
      var end = new Date().getTime();
      var time = end - start;
      console.log("Time taken (seconds) = " + time/1000.0);    
      drawBoard(outputBoard, $(".board"));
      $("#display_time > p").text(time);       
    });

    $("#clear_solver").on("click", function(evt){
      evt.preventDefault(); // Prevent browser from refreshing on click.
      drawBoard(board, $(".board"));
    });
      
});

// function runSingleBlockCases(): void{
//     //Math.floor(Math.random() * 6) + 1;  
    
//     for (var i = 0; i < 10 ; i++){
//         // An integer from 1 to 11.
//         var tl = Math.floor(Math.random() * 6) + 6;
//         var tr = Math.floor(Math.random() * 6) + 6;
//         var bl = Math.floor(Math.random() * 6) + 6;
//         var br = Math.floor(Math.random() * 6) + 6;
//         var result = validBlock(tl, tr, bl, br);
//         console.log("(" + tl + ", " + tr + ", " + bl + ", " + br + ")");
//     }
// }

