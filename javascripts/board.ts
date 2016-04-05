enum Square {
    Empty,
    TriTL, // triangle covering the top left corner
    TriTR,
    TriBL,
    TriBR,
    Dot,
    Black,
    Black0,
    Black1,
    Black2,
    Black3,
    Black4
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

function squareToString(type: Square): string {
    switch (type) {
        case Square.Empty:
            return "Empty";
        case Square.TriTL:
            return "TriTL";
        case Square.TriTR:
            return "TriTR";
        case Square.TriBL:
            return "TriBL";
        case Square.TriBR:
            return "TriBR";
        case Square.Dot:
            return "Dot";
        case Square.Black:
            return "Black";
        case Square.Black0:
            return "Black0";
        case Square.Black1:
            return "Black1";
        case Square.Black2:
            return "Black2";
        case Square.Black3:
            return "Black3";
        case Square.Black4:
            return "Black4";
        default:
            throw "Invalid enum value!";
    }
}