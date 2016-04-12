/// <reference path="board.ts" />

/**
 * Considers a square to be made of four right triangles, and returns whether
 * they are black or not. The directions are:
 * 
 *   \ 0 /
 * 
 *   1 X 2
 * 
 *   / 3 \
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
            return [true, false, true, false][direction];
        case Square.TriBL:
            return [false, true, false, true][direction];
        case Square.TriBR:
            return [false, false, true, true][direction];
    }
}

/**
 * Returns null if the board is unsolvable
 */
function seqSolve(board: Square[][]) : Square[][] {
    return null;
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
    
    // [{dr: -1, dc: 0}, {dr: 0, dc: -1}, {dr: 1, dc: 0}, {dr: 0, dc: 1}].forEach((dir, i, a) => {
    for (var direction = 0; direction < 4; direction++) {
        if (isDisconnected(board, row, col, row + direction)) {
            remove(possible, (direction + 2) % 4);
            remove(possible, (direction + 3) % 4);
        }
    }
}

function isDisconnected(board: Square[][], row: number, col: number, direction: number): boolean {
    var adj = [
        {row: row - 1, col: col},
        {row: row, col: col - 1},
        {row: row + 1, col: col},
        {row: row, col: col + 1}][direction];
    if (adj.row >= 0 && adj.row < board.length && adj.col >= 0 && adj.col < board[0].length) {
        // Return whether the adjacent square is black on the side it shares with our square
        return isBlackAt(board[adj.row][adj.col], (direction + 2) % 4);
    } else {
        return true;
    }
}

function countAdjOfType(type: Square, board: Square[][], row: number, col: number): number {
    
}

/**
 * Removes the first occurrence of an element in the array, if any.
 * Returns true if removal happened
 */
function remove<T>(arr: T[], element: T): boolean {
    if (arr.indexOf(element) == -1) {
        return false;
    } else {
        arr.splice(arr.indexOf(element), 1);
        return true;
    }
}