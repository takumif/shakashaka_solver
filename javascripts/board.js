var Square;
(function (Square) {
    Square[Square["Empty"] = 0] = "Empty";
    Square[Square["Black"] = 1] = "Black";
    Square[Square["Black0"] = 2] = "Black0";
    Square[Square["Black1"] = 3] = "Black1";
    Square[Square["Black2"] = 4] = "Black2";
    Square[Square["Black3"] = 5] = "Black3";
    Square[Square["Black4"] = 6] = "Black4";
    Square[Square["Dot"] = 7] = "Dot";
    Square[Square["TriTL"] = 8] = "TriTL";
    Square[Square["TriTR"] = 9] = "TriTR";
    Square[Square["TriBL"] = 10] = "TriBL";
    Square[Square["TriBR"] = 11] = "TriBR";
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
function getNextSquareType(current) {
    var next = current + 1;
    if (next in Square) {
        return next;
    }
    else {
        return 0;
    }
}
function getPrevSquareType(current) {
    var prev = current - 1;
    if (prev >= 0) {
        return prev;
    }
    else {
        return Square.TriBR; // hard-code the last one for now
    }
}
function squareToString(type) {
    return Square[type];
}
function stringToSquare(name) {
    return Square[name];
}
