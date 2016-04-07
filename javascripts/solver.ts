/// <reference path="board.ts" />

function isSolved(board: Square[][]): boolean {
    if (hasEmptyCell(board)) {
        return false;
    }
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[0].length; col++) {
            if (!isValidCorner(row, col, board)) {
                return false;
            }
        }
    }
    return true;
}

function hasEmptyCell(board: Square[][]): boolean {
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[0].length; col++) {
            if (board[row][col] == Square.Empty) {
                return true;
            }
        }
    }
    return false;
}

function isValidCorner(row: number, col: number, board: Square[][]): boolean {
    return false;
}