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
