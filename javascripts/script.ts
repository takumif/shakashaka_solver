/// <reference path="../typings/main.d.ts" />
/// <reference path="board.ts" />
/// <reference path="board_io.ts" />
/// <reference path="solver.ts" />
/// <reference path="seq_solver.ts" />
/// <reference path="par_worker.ts" />

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function _timer(callback) {
    var time = 0;     //  The default time of the timer
    var status = 0;    //    Status: timer is running or stoped
    var timer_id;    //    This is used by setInterval function
    
    this.start = function(interval) {
      interval = (typeof(interval) !== 'undefined') ? interval : 1000;
      if(status == 0){
        status = 1;
        timer_id = setInterval(function(){
            if(time < 86400){
                time++;
                generateTime();
                if(typeof(callback) === 'function') callback(time);
            }
        }, interval);
      }
    }
    
    this.stop = function(){
      if(status == 1){
          status = 0;
          clearInterval(timer_id);
      }
    }
    
    this.getTime = function(){
      return time;
    }   
    
    this.getStatus = function(){
      return status;
    }

    this.reset = function(sec) {
      sec = (typeof(sec) !== 'undefined') ? sec : 0;
      time = sec;
      generateTime();
    }
    
    // Format timer string.
    function generateTime() {
      var second = time % 60;
      var minute = Math.floor(time / 60) % 60;
      var hour = Math.floor(time / 3600) % 60;       
      var sec = (second < 10) ? '0'+second.toString() : second.toString();
      var min = (minute < 10) ? '0'+minute.toString() : minute.toString();
      var hr = (hour < 10) ? '0'+hour.toString() : hour.toString();      
      $('div.timer span.second').html(sec);
      $('div.timer span.minute').html(min);
      $('div.timer span.hour').html(hr);
    }
}

$(() => {

    var boards:Square[][][] = [  
      [[2,0,0,1,1],[0,0,0,0,0],[0,0,0,0,3],[0,0,0,0,0],[1,0,0,4,0]],
      [[3,0,0,0,1],[0,0,0,0,0],[0,0,6,0,0],[1,0,0,4,0],[1,0,0,0,1]],
      [[0,0,1,0,2],[0,0,0,1,0],[0,4,0,0,0],[0,0,4,0,0],[0,0,0,0,0]]
    ];
    var board;
    var partialBoard_1 = [[2,7,7,1,1],[0,0,0,7,7],[0,0,0,0,3],[10,0,0,11,0],[1,10,11,4,0]];        
    var partialBoard_2 = [[3,0,0,9,1],[8,9,0,0,9],[10,11,6,0,0],[1,0,0,4,7],[1,0,0,7,1]];
    // 3) solves really fast on its own.
    var whichBoard;
    // Initial board.
    board = [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]];
    
    drawBoard(board, $(".board"));  
    $("#display_time > p").text("");

    // Start timer for user.
    var timer = new _timer(
      function(time) {
        if (time == 0) {
          timer.stop();
          alert('time out');
        }
      }
    );

    $("#rand_board").on("click", function(evt){
      evt.preventDefault(); 
      var rand_ind = getRandomInt(0,3);
      board = boards[rand_ind];
      whichBoard = rand_ind;      
      drawBoard(board, $(".board")); 
      bindSquares();  
      timer.reset();
      // Start timer when player asks for new board.
      timer.start(1000);   
    });
    
    $("#stop_timer").on("click", function(evt){
      evt.preventDefault(); 
      timer.stop();
    });

    $("#run_par_solver").on("click", function(evt){
      evt.preventDefault(); // Prevent browser from refreshing on click.
      var start = new Date().getTime();
      var solver = new ParallelSolver();
      
      function fetchPartialBoard(board_id): Square[][]{
        if (board_id == 0){
          return partialBoard_1;
        } else if (board_id == 1){
          return partialBoard_2;
        } else{
          return boards[2];
        }
      }      
      var tmpBoard = fetchPartialBoard(whichBoard); // Fetch current board.
      var outputBoard = solver.parSolve(tmpBoard, function(result){
        drawBoard(result, $(".board"));
        var end = new Date().getTime();
        var time = (end - start)/1000.0;
        console.log("Time taken (seconds) = " + time);    
        $("#display_time > p").text(time); 
      });      
    });
    
    // Spawn only one worker thread, so still sequential.
    $("#run_seq_solver").on("click", function(evt){
      evt.preventDefault(); 
      var worker = new ParallelWorker();      
      var start = new Date().getTime();
      worker.submitWork(board, function(result){
        var end = new Date().getTime();
        var time = (end - start)/1000.0;
        console.log("Time taken (seconds) = " + time);    
        drawBoard(result, $(".board"));
        $("#display_time > p").text(time); 
        worker.kill();        
      });                      
    });

    $("#clear_solver").on("click", function(evt){
      evt.preventDefault(); 
      drawBoard(board, $(".board"));
      $("#display_time > p").text("");
    });
      
});