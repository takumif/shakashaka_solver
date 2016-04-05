/// <reference path="board.ts" />
/// <reference path="../typings/main.d.ts" />


function drawBoard(board: Square[][]): void {
    $(".board").empty();
    if (board.length === 0) {
        return;
    }
    
    for (var row = 0; row < board.length; row++) {
        var rowDiv = $("<div></div>", {
            id: "row" + String(row),
            class: "row"
        });
        for (var col = 0; col < board[0].length; col++) {
            var squareDiv = $("<div></div>", {
                id: "r" + String(row) + "c" + String(col),
                row: row,
                col: col,
                class: "square",
                squareType: squareToString(board[row][col])
            });
            rowDiv.append(squareDiv);
        }
        $(".board").append(rowDiv);
    }
}

