/// <reference path="board.ts" />
/// <reference path="solver.ts" />
/// <reference path="solver_helper.ts" />

class ParallelSolver {
    private workers: ParallelWorker[];
    private static workerScript = "par_worker.js";
    private static workerCount = 10;
    
    constructor() {
        this.initWorkers();
    }
    
    /**
     * Returns null if the board is unsolvable. Does not modify the input board
     */
    parSolve(originalBoard: Square[][]): Square[][] {
        var board = copyBoard(originalBoard);
        var progress = true;
        while (progress) {
            progress = fillDeducibleSquares(board);
        }
        if (isSolved(board)) {
            return board;
        } else {
            return this.parSolveByGuessing(board);
        }
    }

    /**
     * Returns null if the board is unsolvable. Does not modify the input board
     */
    private parSolveByGuessing(originalBoard: Square[][]): Square[][] {
        for (var row = 0; row < originalBoard.length; row++) {
            for (var col = 0; col < originalBoard[0].length; col++) {
                var solution = this.parSolveByGuessingForSquare(originalBoard, row, col);
                if (solution != null) {
                    return solution;
                }
            }
        }
        return null;
    }
    
    /**
     * Returns null if the board is unsolvable or the square is already filled.
     * Does not modify the input board
     */
    private parSolveByGuessingForSquare(originalBoard: Square[][], row: number, col: number): Square[][] {
        if (originalBoard[row][col] == Square.Empty) {
            var possibilities = [Square.TriTR, Square.TriTL, Square.TriBL, Square.TriBR, Square.Dot];
            for (var i in possibilities) {
                var board = copyBoard(originalBoard);
                board[row][col] = possibilities[i];
                if (mayBeSolvable(board)) {
                    this.sendBoardToAWorker(board);
                }
            }
        }
        return null;
    }
    
    private sendBoardToAWorker(board: Square[][]): void {
        var worker = this.getLeastBusyWorker();
        worker.submitWork(board, (result) => {
            if (result != null) {
                console.log(result);
            }
        });
    }

    private initWorkers(): void {
        this.workers = new Array(ParallelSolver.workerCount);
        for (var i = 0; i < ParallelSolver.workerCount; i++) {
            this.workers[i] = new ParallelWorker();
        }
    }
    
    private getLeastBusyWorker(): ParallelWorker {
        var worker = this.workers[0];
        var minWorkCount = this.workers[0].getWorkCount();
        for (var i = 1; i < this.workers.length; i++) {
            var ithWorker = this.workers[i];
            if (ithWorker.getWorkCount() < minWorkCount) {
                console.log(i);
                worker = ithWorker;
                minWorkCount = ithWorker.getWorkCount();
            }
        }
        return worker;
    }
}