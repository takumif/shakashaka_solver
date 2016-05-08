/**
 * Returns true if progress was made. Mutates the input
 */
function fillDeducibleSquares(board) {
    var progress = false;
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[0].length; col++) {
            if (board[row][col] == Square.Empty) {
                var square = deduce(board, row, col);
                if (square != null) {
                    progress = true;
                    board[row][col] = square;
                }
            }
        }
    }
    return progress;
}
/**
 * Returns what should go in a Square if it can be determined based on the surrounding
 * squares; null otherwise
 */
function deduce(board, row, col) {
    var possible = deduceBasedOnAdj(board, row, col);
    possible = getIntersection(possible, deduceBasedOnNumberedNeighbors(board, row, col));
    return possible.length == 1 ? possible[0] : null;
}
function deduceBasedOnAdj(board, row, col) {
    var possible = [Square.TriTR, Square.TriTL, Square.TriBL, Square.TriBR, Square.Dot];
    for (var direction = 0; direction < 4; direction++) {
        if (isDisconnected(board, row, col, direction)) {
            remove(possible, getTriangleOfDirection((direction + 2) % 4));
            remove(possible, getTriangleOfDirection((direction + 3) % 4));
        }
    }
    return possible;
}
function deduceBasedOnNumberedNeighbors(board, row, col) {
    var possible = [Square.TriTR, Square.TriTL, Square.TriBL, Square.TriBR, Square.Dot];
    for (var direction = 0; direction < 4; direction++) {
        if (numberedNeighborRequiresDot(board, row, col, direction)) {
            return [Square.Dot];
        }
        if (numberedNeighborRequiresTriangle(board, row, col, direction)) {
            remove(possible, getTriangleOfDirection((direction + 2) % 4));
            remove(possible, getTriangleOfDirection((direction + 3) % 4));
            remove(possible, Square.Dot);
        }
    }
    return possible;
}
function numberedNeighborRequiresDot(board, row, col, direction) {
    var neighbor = getRowColInDirection(board, row, col, direction);
    if (neighbor != null && isNumberedSquare(board[neighbor.row][neighbor.col])) {
        return (countAdjTriangles(board, neighbor.row, neighbor.col) >=
            getNumberOnSquare(board[neighbor.row][neighbor.col]));
    }
    else {
        return false;
    }
}
function numberedNeighborRequiresTriangle(board, row, col, direction) {
    var neighbor = getRowColInDirection(board, row, col, direction);
    if (neighbor != null && isNumberedSquare(board[neighbor.row][neighbor.col])) {
        return (countAdjTriangles(board, neighbor.row, neighbor.col) +
            countAdjEmpty(board, neighbor.row, neighbor.col) <=
            getNumberOnSquare(board[neighbor.row][neighbor.col]));
    }
    else {
        return false;
    }
}
/**
 * Counts the number of adjacent black triangles that share sides with the square
 */
function countAdjTriangles(board, row, col) {
    var count = 0;
    for (var direction = 0; direction < 4; direction++) {
        var adj = getRowColInDirection(board, row, col, direction);
        if (adj != null && isBlackAt(board[adj.row][adj.col], (direction + 2) % 4)) {
            count++;
        }
    }
    return count;
}
function countAdjEmpty(board, row, col) {
    var count = 0;
    for (var direction = 0; direction < 4; direction++) {
        var adj = getRowColInDirection(board, row, col, direction);
        if (adj != null && board[adj.row][adj.col] == Square.Empty) {
            count++;
        }
    }
    return count;
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
function isDisconnected(board, row, col, direction) {
    var adj = [
        { row: row - 1, col: col },
        { row: row, col: col - 1 },
        { row: row + 1, col: col },
        { row: row, col: col + 1 }][direction];
    if (isWithinBounds(board, adj.row, adj.col)) {
        // Return whether the adjacent square is black on the side it shares with our square
        return isBlackAt(board[adj.row][adj.col], (direction + 2) % 4);
    }
    else {
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
function isBlackAt(square, direction) {
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
