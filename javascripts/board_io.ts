/// <reference path="board.ts" />
/// <reference path="../typings/main.d.ts" />


function drawBoard(board: Square[][], boardDiv: JQuery): void {
    boardDiv.empty();
    if (board.length === 0) {
        return;
    }
    
    for (var row = 0; row < board.length; row++) {
        var rowDiv = $("<div></div>", {
            id: "row" + String(row),
            class: "row"
        });
        for (var col = 0; col < board[0].length; col++) {
            var squareDiv = $("<img></img>", {
                id: "r" + String(row) + "c" + String(col),
                row: row,
                col: col,
                class: "square",
                squareType: squareToString(board[row][col]),
                src: "images/" + squareToString(board[row][col]) + ".png"
            });
            rowDiv.append(squareDiv);
        }
        boardDiv.append(rowDiv);
    }
}

function getBoardData(boardDiv: JQuery): Square[][] {
    var board: Square[][] = new Array(boardDiv.find(".row").length);
    if (board.length === 0) {
        return board;
    }
    var cols = boardDiv.find(".row").get(0).children.length;
    for (var row = 0; row < board.length; row++) {
        board[row] = new Array(cols);
        for (var col = 0; col < cols; col++) {
            board[row][col] = stringToSquare($("[row=" + row + "][col=" + col + "]").attr("squareType"));
        }
    }
    return board;
}

function bindSquares(): void {
    $(".square").mousedown((event) => {
        event.preventDefault();
        
        switch (event.which) {
        case 1: // left click
            var square = event.target;
            var currentType = stringToSquare(square.getAttribute("squareType"));
            if (currentType > 0 && currentType < 7) break; // Skip black squares.
            if (currentType == 0) currentType = 6; // So to start at dot.
            var nextTypeStr = squareToString(getNextSquareType(currentType));
            square.setAttribute("squareType", nextTypeStr);
            $(square).attr("src", "images/" + nextTypeStr + ".png");
            break;
        case 3: // right click
            var square = event.target;
            var currentType = stringToSquare(square.getAttribute("squareType"));
            if (currentType > 0 && currentType < 7) break; // Skip black squares.
            if (currentType == 7) currentType = 12; // BR triangle
            var prevTypeStr = squareToString(getPrevSquareType(currentType));
            square.setAttribute("squareType", prevTypeStr);
            $(square).attr("src", "images/" + prevTypeStr + ".png");
            break;
        }
    })
}