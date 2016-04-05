var Square;
(function (Square) {
    Square[Square["Empty"] = 0] = "Empty";
    Square[Square["TriTL"] = 1] = "TriTL";
    Square[Square["TriTR"] = 2] = "TriTR";
    Square[Square["TriBL"] = 3] = "TriBL";
    Square[Square["TriBR"] = 4] = "TriBR";
    Square[Square["Dot"] = 5] = "Dot";
    Square[Square["Black"] = 6] = "Black";
    Square[Square["Black0"] = 7] = "Black0";
    Square[Square["Black1"] = 8] = "Black1";
    Square[Square["Black2"] = 9] = "Black2";
    Square[Square["Black3"] = 10] = "Black3";
    Square[Square["Black4"] = 11] = "Black4";
})(Square || (Square = {}));
function initBoard(rows, cols) {
    var board = new Array(rows);
    for (var r = 0; r < rows; r++) {
        board[r] = new Array(cols);
        for (var c = 0; c < cols; c++) {
            board[r][c] = Square.Empty;
        }
    }
    return board;
}
function squareToString(type) {
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
