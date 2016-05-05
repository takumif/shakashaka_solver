/// <reference path="board.ts" />
/// <reference path="solver.ts" />
/// <reference path="solver_helper.ts" />

class ParallelSolver {
    private static workerScript = "par_worker.js";
    private static workerCount = 10;
    private workers: ParallelWorker[];
    private idleWorkers: number;
    private boardsToSolve: Square[][][];
    private callback: (result: Square[][]) => void;
    private finished: boolean;
    
    /**
     * Does not modify the input board. The callback is called with null as the
     * result if the board is unsolvable
     */
    parSolve(originalBoard: Square[][], callback: (result: Square[][]) => void): void {
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
        } else {
            this.parSolveByGuessing(board);
        }
    }

    /**
     * Does not modify the input board
     */
    private parSolveByGuessing(originalBoard: Square[][]): void {
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
    }
    
    /**
     * Does not modify the input board
     */
    private parSolveByGuessingForSquare(originalBoard: Square[][], row: number, col: number): void {
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
    }
    
    private sendBoardToWorker(board: Square[][], worker: ParallelWorker): void {
        worker.submitWork(board, (result) => {
            if (!this.finished) {
                if (result != null) {
                    this.finishSolving(result);
                } else {
                    if (this.boardsToSolve.length == 0) {
                        this.idleWorkers++;
                        if (this.idleWorkers == this.workers.length) {
                            this.finishSolving(null);
                        }
                    } else {
                        this.sendBoardToWorker(this.boardsToSolve.pop(), worker);
                    }
                }
            }
        });
    }
    
    private finishSolving(result: Square[][]): void {
        this.finished = true;
        this.callback(result);
        this.killWorkers();
    }

    private initWorkers(): void {
        this.workers = new Array(ParallelSolver.workerCount);
        for (var i = 0; i < ParallelSolver.workerCount; i++) {
            this.workers[i] = new ParallelWorker();
        }
    }
    
    private killWorkers(): void {
        for (var i = 0; i < this.workers.length; i++) {
            this.workers[i].kill();
        }
        this.workers = [];
    }
}