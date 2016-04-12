/// <reference path="board.ts" />
/// <reference path="solver.ts" />


/**
 * Returns null if the board is unsolvable. Does not modify the input board
 */
function seqSolve(originalBoard: Square[][]): Square[][] {
    var board = copyBoard(originalBoard);
    var progress = true;
    while (progress) {
        progress = fillDeducibleSquares(board);
    }
    if (isSolved(board)) {
        return board;
    } else {
        return seqSolveByGuessing(board);
    }
}

/**
 * Returns null if the board is unsolvable. Does not modify the input board
 */
function seqSolveByGuessing(originalBoard: Square[][]): Square[][] {
    for (var row = 0; row < originalBoard.length; row++) {
        for (var col = 0; col < originalBoard[0].length; col++) {
            var solution = seqSolveByGuessingForSquare(originalBoard, row, col);
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
function seqSolveByGuessingForSquare(originalBoard: Square[][], row: number, col: number): Square[][] {
    if (originalBoard[row][col] == Square.Empty) {
        var possibilities = [Square.TriTR, Square.TriTL, Square.TriBL, Square.TriBR, Square.Dot];
        for (var i in possibilities) {
            var board = copyBoard(originalBoard);
            board[row][col] = possibilities[i];
            var solution = seqSolve(board);
            if (solution != null) {
                return solution;
            }
        }
    }
    return null;
}

/**
 * Returns true if progress was made. Mutates the input
 */
function fillDeducibleSquares(board: Square[][]): boolean {
    var progress = false;
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[0].length; col++) {
            var square = deduce(board, row, col);
            if (square != null) {
                progress = true;
                board[row][col] = square;
            }
        }
    }
    return progress;
}

/**
 * Returns a Square if its type can be determined based on the surrounding
 * squares; null otherwise
 */
function deduce(board: Square[][], row: number, col: number): Square {
    
    var possible = deduceBasedOnAdj(board, row, col);
    
    return possible.length == 1 ? possible[0] : null;
}

function deduceBasedOnAdj(board: Square[][], row: number, col: number): Square[] {
    var possible = [Square.TriTR, Square.TriTL, Square.TriBL, Square.TriBR, Square.Dot];
    
    for (var direction = 0; direction < 4; direction++) {
        if (isDisconnected(board, row, col, direction)) {
            remove(possible, (direction + 2) % 4);
            remove(possible, (direction + 3) % 4);
        }
    }
    return possible;
}

/**
 * Returns true if the square cannot  share a white rectangle with the neighbor in that direction.
 * The directions are:
 * 
 *   . 0 .
 * 
 *   1 X 3
 * 
 *   . 2 .
 */
function isDisconnected(board: Square[][], row: number, col: number, direction: number): boolean {
    var adj = [
        {row: row - 1, col: col},
        {row: row, col: col - 1},
        {row: row + 1, col: col},
        {row: row, col: col + 1}][direction];
    if (isWithinBounds(board, adj.row, adj.col)) {
        // Return whether the adjacent square is black on the side it shares with our square
        return isBlackAt(board[adj.row][adj.col], (direction + 2) % 4);
    } else {
        return true; 
    }
}

/**
 * Considers a square to be made of four right triangles, and returns whether
 * a triangle is black or not. The directions (of where the triangle is) are:
 * 
 *   . 0 .
 * 
 *   1 X 3
 * 
 *   . 2 .
 */
function isBlackAt(square: Square, direction: number): boolean {
    switch (square) {
        case Square.Empty:
        case Square.Dot:
            return [false, false, false, false][direction];
        case Square.Black:
        case Square.Black0:
        case Square.Black1:
        case Square.Black2:
        case Square.Black3:
        case Square.Black4:
            return [true, true, true, true][direction];
        case Square.TriTL:
            return [true, true, false, false][direction];
        case Square.TriTR:
            return [true, false, false, true][direction];
        case Square.TriBL:
            return [false, true, true, false][direction];
        case Square.TriBR:
            return [false, false, true, true][direction];
    }
}