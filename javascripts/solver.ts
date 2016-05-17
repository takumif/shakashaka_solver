/// <reference path="board.ts" />

interface BlockAngles {
    [type: number]: number;   
}

// Defines angles for each orientation of triangle within 2 by 2 block.
// TL TR BR BL DOT , black squares contribute 0 degrees.
var anglesTL:BlockAngles = {8:90, 9:45, 11:0, 10:45, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 0:90}; 
var anglesTR:BlockAngles = {8:45, 9:90, 11:45, 10:0, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 0:90}; 
var anglesBL:BlockAngles = {8:45, 9:0, 11:45, 10:90, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 0:90}; 
var anglesBR:BlockAngles = {8:0, 9:45, 11:90, 10:45, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 0:90}; 

function mayBeSolvable(board:Square[][]):boolean {
    // Empty board is may be solvable.   
    var numRows = board.length;
    var numCols = board[0].length;        
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col <numCols; col++) {          
            if ((row < numRows - 1) && (col < numCols - 1)){    
                // Triangles and position in 2 by 2.
                var TL = board[row][col];
                var TR = board[row][col + 1];
                var BL = board[row + 1][col];
                var BR = board[row + 1][col + 1];              
                var subBoard = [TL, TR, BR, BL];
                if (!validBlock(subBoard, true)){
                    //console.log("mayBeAngle check");
                    return false;
                }                                                       
                if (!checkSide(subBoard, numRows, numCols, row, col, maybeValidAngle)){
                    //console.log("checkSide");
                    return false;
                }      
            }
            // Black squares with invalid side triangles. DO NOT consider number of triangles.   
            if (!blackSquareWithInvalidTriangle(row, col, board)) {
                //console.log("black square");
                return false;            
            }
        }
    }  
    if (!checkCorners(board)) return false;
    return true;
}

function isSolved(board: Square[][]): boolean {
    if (hasEmptyCell(board)) {
        return false;
    }       
    var numRows = board.length;
    var numCols = board[0].length;        
    for (var row = 0; row < numRows - 1; row++) {
        for (var col = 0; col <numCols - 1; col++) {            
            if ((row < numRows - 1) && (col < numCols - 1)){    
                var TL = board[row][col];
                var TR = board[row][col + 1];
                var BL = board[row + 1][col];
                var BR = board[row + 1][col + 1];
                var subBoard = [TL, TR, BR, BL];      
                if (!validBlock(subBoard, false)){
                    console.log("validBlock");
                    return false;
                }
                if (!checkSide(subBoard, numRows, numCols, row, col, isValidAngle)){
                    console.log("checkSide");
                    return false;
                }
            }
            if (checkBlackSquare(row, col, board) == false){
                console.log("checkBlackSquare");
                return false;
            }                   
        }
    }  
    if (checkCorners(board) == false) return false;
    return true;
} 

function validBlock(cellTypes:Square[], flag:boolean):boolean {
    var subTriangles = [];
    var ind = 0;
    var numNonEmpty = 0;            
    for (var type of cellTypes){
        if (type > 0) {
            numNonEmpty++;
        }
        if (ind == 0){
            subTriangles.push(isBlackAt(type, 2));
            subTriangles.push(isBlackAt(type, 3));
        } else if (ind == 1){
            subTriangles.push(isBlackAt(type, 1));
            subTriangles.push(isBlackAt(type, 2));
        } else  if (ind == 2){
            subTriangles.push(isBlackAt(type, 0));
            subTriangles.push(isBlackAt(type, 1));
        } else{
            subTriangles.push(isBlackAt(type, 3));
            subTriangles.push(isBlackAt(type, 0));
        }
        ind++;
    }     
    if (numNonEmpty < 4 && flag) return true;
    var len = subTriangles.length;
    var i = 0;
    var firstAngle = 0;
    var angle = 0;   
    while (i < 8){
        // reach the first "black tri."
        if (subTriangles[i] == true){
            break;
        }
        firstAngle += 1;
        i++;
    }    
    while (i < 8){
        if (subTriangles[i] == true){
            // angle == 6 is 270 degrees.
            if (angle % 2 == 1 || (angle == 6 && !flag)){
                return false;
            } else {
                angle = 0;
            }
        } else {
            angle += 1;
        }
        i++;
    }   
    var sum = angle + firstAngle;
    if ((sum % 2 == 1) || (sum == 6 && !flag)){
        return false;
    }   
    return true;    
}

function checkBlackSquare(row:number, col:number, board:Square[][]):boolean {
    var type = board[row][col];        
    var numRows = board.length;
    var numCols = board[0].length; 
    // Not a black square with number
    if (type >= Square.Dot || type <= 1 || type <= Square.Black){
        return true; // Do not return any value. No check - no error.
    }
    var reqTriangles = blackSqNum(type);
    var leftCell = -1;
    var rightCell = -1;
    var topCell = -1;
    var bottomCell = -1;
    var counter = 0;    
    // All types surrounding cell.
    if ((col - 1) >= 0) leftCell = board[row][col - 1];
    if ((col + 1) < numCols) rightCell = board[row][col + 1];
    if ((row - 1) >= 0) topCell = board[row - 1][col];
    if ((row + 1) < numRows) bottomCell = board[row + 1][col];  
    
    //console.log("surrounding types : " + leftCell + ", " + rightCell + ", " + topCell + ", " + bottomCell + " ");
              
    // Now check up to 4 adjacent cells for black triangles.
    if ((leftCell != -1) && (leftCell == Square.TriTR || leftCell == Square.TriBR)){
        //console.log("left");
        counter += 1;
    }
    if ((rightCell != -1) && (rightCell == Square.TriBL || rightCell == Square.TriTL)){
        //console.log("right");
        counter += 1;
    }
    if ((topCell != -1) && (topCell == Square.TriBL || topCell == Square.TriBR)){
        //console.log("top");
        counter += 1;
    }   
    if ((bottomCell != -1) && (bottomCell == Square.TriTL || bottomCell == Square.TriTR)){
        //console.log("bottom");
        counter += 1;
    }      
    if (counter != reqTriangles){
        // console.log("req tri: " + reqTriangles);
        // console.log("counter: " + counter);
        // console.log("check black " + type + ": " + row + ", " + col);
        return false;
    }       
    return true;
}

function checkSide(subBoard:Square[], numRows:number, numCols:number, 
        row:number, col:number, f:(arg:number)=>boolean):boolean{  
    var tl = subBoard[0];
    var tr = subBoard[1];
    var bl = subBoard[3];
    var br = subBoard[2];   
    if (row == 0){
        //console.log("top");
        if (checkTopSide(tl, tr, f) == false) return false;
    }
    if (col == 0){
        //console.log("left side");
        if (checkLeftSide(tl, bl, f) == false) return false;
    }
    if (col == numCols - 2){
       //console.log("right side");
        if (checkRightSide(tr, br, f) == false) return false;
    }
    if (row == numRows - 2){
        //console.log("bottom");
        if (checkBottomSide(bl, br, f) == false) return false;
    }  
    return true;      
}

function checkCorners(board: Square[][]):boolean{   
    if (board == null) return false;    
    var numRows = board.length;
    var numCols = board[0].length;  
    var topleft = board[0][0];
    var topright = board[0][numCols - 1];
    var bottomleft = board[numRows - 1][0];
    var bottomright = board[numRows - 1][numCols - 1];    
    if (topleft ==  Square.TriTR || topleft == Square.TriBL || topleft == Square.TriBR){
        return false;
    }  
    if (topright == Square.TriTL || topright == Square.TriBL || topright == Square.TriBR){
        return false;
    }
    if (bottomleft == Square.TriTL || bottomleft == Square.TriBR || bottomleft == Square.TriTR){
        return false;
    }
    if (bottomright == Square.TriBL || bottomright == Square.TriTL || bottomright == Square.TriTR){
        return false;
    }
    return true;
}

// Returns false for triangles that cannot be adjacent to the black square.
function blackSquareWithInvalidTriangle(row:number, col:number, board:Square[][]): boolean{
    var type = board[row][col];
    var numRows = board.length;
    var numCols = board[0].length; 
    // Not a black square with number
    if (type >= Square.Dot || type <= Square.Black){
        return true; // Do not return any value. No check - no error.
    }
    var leftCell = -1;
    var rightCell = -1;
    var topCell = -1;
    var bottomCell = -1;
    // All types surrounding cell.
    if ((col - 1) >= 0) leftCell = board[row][col - 1];
    if ((col + 1) < numCols) rightCell = board[row][col + 1];
    if ((row - 1) >= 0) topCell = board[row - 1][col];
    if ((row + 1) < numRows) bottomCell = board[row + 1][col]; 
    if ((leftCell != -1) && (leftCell == Square.TriTL || leftCell == Square.TriBL)) return false;     
    if ((rightCell != -1) && (rightCell == Square.TriTR || rightCell == Square.TriBR)) return false;     
    if ((topCell != -1) && (topCell == Square.TriTL || topCell == Square.TriTR)) return false;     
    if ((bottomCell != -1) && (bottomCell == Square.TriBL || bottomCell == Square.TriBR)) return false;     
    return true;
}

/************************************** AUX FUNCTIONS ***********************************************/

function maybeValidAngle(angle:number):boolean {
    return (angle == 0 || angle > 45);
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

function isValidAngle(angle:number): boolean{
    if (!(angle == 0 || angle == 90 || angle == 180 || angle == 360)){
        return false;
    }    
    return true;
}

function blackSqNum(cell:Square): number{
    var reqTriangles = 0;  
    switch (cell){
        case Square.Black0:
            reqTriangles = 0;    
            break;
        case Square.Black1:
            reqTriangles = 1;    
            break; 
        case Square.Black2:
            reqTriangles = 2;    
            break;
        case Square.Black3:
            reqTriangles = 3;    
            break;
        case Square.Black4:
            reqTriangles = 4;    
            break;                                           
    }
    return reqTriangles;
}

function checkBottomSide(cell1:number, cell2:number, checkAngle:(arg:number)=>boolean):boolean {
    var firstAngle = anglesTL[cell1];
    var secondAngle = anglesTR[cell2];      
    if ((firstAngle > 0) && (cell1 == Square.TriTL || cell1 == Square.TriBL || cell1 == Square.Dot)){
        if (cell2 != Square.TriTL){
            firstAngle += secondAngle;
        }
    }     
    if (!checkAngle(firstAngle)) return false;
    firstAngle =  anglesTL[cell1];    
    if ((secondAngle > 0) && (cell2 == Square.TriTR || cell2 == Square.TriBR || cell2 == Square.Dot)){
        if (cell1 != Square.TriTR){
            secondAngle += firstAngle;
        }
    }
    return checkAngle(secondAngle);  
}

function checkRightSide(cell1:number, cell2:number, checkAngle:(arg:number)=>boolean):boolean {   
    var firstAngle = anglesTL[cell1];
    var secondAngle = anglesBL[cell2];   
    if ((firstAngle > 0) && (cell1 == Square.TriTR || cell1 == Square.TriTL || cell1 == Square.Dot)){
        if (cell2 != Square.TriTL){
            firstAngle += secondAngle;
        }
    }     
    if (!checkAngle(firstAngle)) return false;
    firstAngle =  anglesTL[cell1]; 
    if ((secondAngle > 0) && (cell2 == Square.TriBR || cell2 == Square.TriBL || cell2 == Square.Dot)){
        if (cell1 != Square.TriBR){
            secondAngle += firstAngle;
        }
    }
    return checkAngle(secondAngle);  
}

function checkLeftSide(cell1:number, cell2:number, checkAngle:(arg:number)=>boolean):boolean {  
    var firstAngle = anglesTR[cell1];
    var secondAngle = anglesBR[cell2];
    if ((firstAngle > 0) && (cell1 == Square.TriTR || cell1 == Square.TriTL || cell1 == Square.Dot)){
        if (cell2 != Square.TriTR){
            firstAngle += secondAngle;
        }
    }     
    if (!checkAngle(firstAngle)) return false;    
    firstAngle =  anglesTR[cell1];    
    if ((secondAngle > 0) && (cell2 == Square.TriBR || cell2 == Square.TriBL || cell2 == Square.Dot)){
        if (cell1 != Square.TriBR){
            secondAngle += firstAngle;
        }
    }
    return checkAngle(secondAngle);  
}

function checkTopSide(cell1:number, cell2:number, checkAngle:(arg:number)=>boolean):boolean {  
    var firstAngle = anglesBL[cell1];
    var secondAngle = anglesBR[cell2];  
    if ((firstAngle > 0) && (cell1 == Square.TriTL || cell1 == Square.TriBL || cell1 == Square.Dot)){
        if (cell2 != Square.TriBL){
            firstAngle += secondAngle;
        }
    }     
    if (!checkAngle(firstAngle)) return false;
    firstAngle =  anglesBL[cell1];    
    if ((secondAngle > 0) && (cell2 == Square.TriTR || cell2 == Square.TriBR || cell2 == Square.Dot)){
        if (cell1 != Square.TriBR){
            secondAngle += firstAngle;
        }
    }    
    return checkAngle(secondAngle);   
}

function getAngle(index:number, type:Square):number{
    switch (index){
        case 0:
            return anglesTL[type];
        case 1:
            return anglesTR[type];
        case 2:
            return anglesBR[type];
        case 3:
            return anglesBL[type];
        default:
            return 0;                                    
    }
}