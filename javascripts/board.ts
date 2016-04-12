enum Square {
    Empty,
    Black,
    Black0,
    Black1,
    Black2,
    Black3,
    Black4,
    Dot,
    TriTL, // triangle covering the top left corner
    TriTR,
    TriBL,
    TriBR
}

function initBoard(rows: number, cols: number): Square[][] {
    var board: Square[][] = new Array(rows);
    
    for (var r = 0; r < rows; r++) {
        board[r] = new Array(cols);
        for (var c = 0; c < cols; c++) {
            board[r][c] = Square.Empty;
        }
    }
        
    return board;
}

function getNextSquareType(current: Square): Square {
    var next = current + 1;
    if (next in Square) {
        return next;
    } else {
        return 0;
    }
}

function getPrevSquareType(current: Square): Square {
    var prev = current - 1;
    if (prev >= 0) {
        return prev;
    } else {
        return Square.TriBR; // hard-code the last one for now
    }
}

function squareToString(type: Square): string {
    return Square[type];
}

function stringToSquare(name: string): Square {
    return Square[name];
}

function randomBoard(boardLen:number): Square[][] {
    // Lame input.
    if (boardLen <= 1) return null;
    
    var board: Square[][] = new Array(boardLen);
    
    for (var i = 0; i < boardLen; i++){
        board[i] = new Array(boardLen);
        for (var j = 0; j < boardLen; j++){
            // A random type from 6 to 11.
            board[i][j] = Math.floor(Math.random() * 6) + 6;
        }
    }
    
    return board;
}

function unsolve(board: Square[][]): Square[][] {
    var newBoard = new Array(board.length);
    
    for (var row = 0; row < board.length; row++) {
        newBoard[row] = new Array(board[row].length);
        for (var col = 0; col < board[0].length; col++) {
            if ([Square.Dot, Square.TriTL, Square.TriTR, Square.TriBL, Square.TriBR
                ].indexOf(board[row][col]) != -1) {
                newBoard[row][col] = Square.Empty;
            } else {
                newBoard[row][col] = board[row][col];
            }
        }
    }
    return newBoard;
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

function copyBoard(board: Square[][]): Square[][] {
    var newBoard: Square[][] = new Array(board.length);
    for (var row = 0; row < board.length; row++) {
        newBoard[row] = new Array(board[row].length);
        for (var col = 0; col < board[row].length; col++) {
            newBoard[row][col] = board[row][col];
        }
    }
    return newBoard;
}

function isWithinBounds(board: Square[][], row: number, col: number) {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}