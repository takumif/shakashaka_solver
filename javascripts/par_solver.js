/// <reference path="board.ts" />
/// <reference path="solver.ts" />
/// <reference path="solver_helper.ts" />
var ParallelSolver = (function () {
    function ParallelSolver() {
    }
    /**
     * Does not modify the input board. The callback is called with null as the
     * result if the board is unsolvable
     */
    ParallelSolver.prototype.parSolve = function (originalBoard, callback) {
        this.initWorkers();
        this.idleWorkers = this.workers.length;
        this.boardsToSolve = [];
        this.callback = callback;
        this.finished = false;
        var board = copyBoard(originalBoard);
        var progress = true;
        while (progress) {
            progress = fillDeducibleSquares(board);
        }
        if (isSolved(board)) {
            callback(board);
        }
        else {
            this.parSolveByGuessing(board);
        }
    };
    /**
     * Does not modify the input board
     */
    ParallelSolver.prototype.parSolveByGuessing = function (originalBoard) {
        for (var row = 0; row < originalBoard.length; row++) {
            for (var col = 0; col < originalBoard[0].length; col++) {
                var solution = this.parSolveByGuessingForSquare(originalBoard, row, col);
            }
        }
        for (var i = 0; i < this.workers.length; i++) {
            if (this.boardsToSolve.length == 0) {
                break;
            }
            this.sendBoardToWorker(this.boardsToSolve.pop(), this.workers[i]);
            this.idleWorkers--;
        }
    };
    /**
     * Does not modify the input board
     */
    ParallelSolver.prototype.parSolveByGuessingForSquare = function (originalBoard, row, col) {
        if (originalBoard[row][col] == Square.Empty) {
            var possibilities = [Square.TriTR, Square.TriTL, Square.TriBL, Square.TriBR, Square.Dot];
            for (var i in possibilities) {
                var board = copyBoard(originalBoard);
                board[row][col] = possibilities[i];
                if (mayBeSolvable(board)) {
                    this.boardsToSolve.push(board);
                }
            }
        }
    };
    ParallelSolver.prototype.sendBoardToWorker = function (board, worker) {
        var _this = this;
        worker.submitWork(board, function (result) {
            if (!_this.finished) {
                if (result != null) {
                    _this.finishSolving(result);
                }
                else {
                    if (_this.boardsToSolve.length == 0) {
                        _this.idleWorkers++;
                        if (_this.idleWorkers == _this.workers.length) {
                            _this.finishSolving(null);
                        }
                    }
                    else {
                        _this.sendBoardToWorker(_this.boardsToSolve.pop(), worker);
                    }
                }
            }
        });
    };
    ParallelSolver.prototype.finishSolving = function (result) {
        this.finished = true;
        this.callback(result);
        this.killWorkers();
    };
    ParallelSolver.prototype.initWorkers = function () {
        this.workers = new Array(ParallelSolver.workerCount);
        for (var i = 0; i < ParallelSolver.workerCount; i++) {
            this.workers[i] = new ParallelWorker();
        }
    };
    ParallelSolver.prototype.killWorkers = function () {
        for (var i = 0; i < this.workers.length; i++) {
            this.workers[i].kill();
        }
        this.workers = [];
    };
    ParallelSolver.workerScript = "par_worker.js";
    ParallelSolver.workerCount = 10;
    return ParallelSolver;
}());
