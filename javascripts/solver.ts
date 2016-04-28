/// <reference path="board.ts" />

interface BlockAngles {
    [type: number]: number;   
}

// Defines angles for each orientation of triangle within 2 by 2 block.
// TL TR BR BL DOT , black squares contribute 0 degrees.
var anglesTL:BlockAngles = {8:90, 9:45, 11:0, 10:45, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0}; 
var anglesTR:BlockAngles = {8:45, 9:90, 11:45, 10:0, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0}; 
var anglesBL:BlockAngles = {8:45, 9:0, 11:45, 10:90, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0}; 
var anglesBR:BlockAngles = {8:0, 9:45, 11:90, 10:45, 7:90, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0}; 

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
                
                
                // Any 45 degree angle implies no chance of solving.
                
                
                
                // check top side dots.
                if (row == 0){
                    if (checkTopSide(TL, TR, maybeValidAngle) == false) return false;
                }
                // check left side dots.
                if (col == 0){
                    if (checkLeftSide(TL, BL, maybeValidAngle) == false) return false;
                }
                // check right side dots.
                if (col == numCols - 2){
                    if (checkRightSide(TR, BR, maybeValidAngle) == false) return false;
                }
                // check top side dots.
                if (row == numRows - 2){
                    if (checkBottomSide(BL, BR, maybeValidAngle) == false) return false;
                }        
            }
            
            // Black squares with numbers.
            if (checkBlackSquare(row, col, board) == false){
                return false;
            }    
               
        }
    }
   
    // Corner cases that can never be solved.
    if (!checkCorners(board)) return false;
     
    return true;
}

function innerAngleIsMaybe(board:Square[][]):boolean {
    return true;
}

/**************/

function isSolved(board: Square[][]): boolean {
    if (hasEmptyCell(board)) {
        return false;
    }
        
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

                // Check 2 by 2 block first.
                // if (!isValidBlock(TL, TR, BL, BR)){
                //     return false;
                // }
                
                if (!validBlock([TL,TR, BR, BL])){
                    //console.log("At ("+row + "," + col + ")");
                    return false;
                }
                
                // check top side dots.
                if (row == 0){
                    if (checkTopSide(TL, TR, isValidAngle) == false) return false;
                }
                // check left side dots.
                if (col == 0){
                    if (checkLeftSide(TL, BL, isValidAngle) == false) return false;
                }
                // check right side dots.
                if (col == numCols - 2){
                    if (checkRightSide(TR, BR, isValidAngle) == false) return false;
                }
                // check top side dots.
                if (row == numRows - 2){
                    if (checkBottomSide(BL, BR, isValidAngle) == false) return false;
                }        
            }
            // Black squares with numbers.
            if (checkBlackSquare(row, col, board) == false){
                return false;
            }    
               
        }
    }
    
    // Check invalid corners.
    if (checkCorners(board) == false) return false;
    
    return true;
} /**/

function validBlock(cellTypes:Square[]): boolean{
    // Changes to  tl, tr, br, bl to follow clockwise direction!!!
    var angles:number[] = [0,0,0,0];
    var cellInd = 0; 
    var index = 0;    
    var counter = 0;
    
    // Clockwise direction. 
    while (counter < (cellTypes.length + 2)){

        var currCell = cellTypes[cellInd];
        var nextInd = (cellInd + 1) % 4;
        var nextCell = cellTypes[nextInd];
        var ang = getAngle(cellInd, currCell); 
        
        var prevInd = (cellInd + 3) % 4;
        var prevCell = cellTypes[prevInd];
        
        if (counter == 4 && (currCell < Square.Dot || currCell == Square.TriBL || currCell == Square.TriBR)){
            break;
        }
        // Prev is not accessible.
        if (counter == 4 && (currAccessible(prevInd , prevCell))){
            break;
        }
        
        if (counter == 5 && (currAccessible(prevInd , prevCell)))
            break;
        
        if ((angles[index] + ang) <= 360)
            angles[index] += ang;          
        
        var bl_cell = cellTypes[3];
        if (counter == 0 && (bl_cell == Square.Dot || bl_cell == Square.TriBL || bl_cell == Square.TriBR)){
            if (currCell == Square.TriTR || currCell == Square.TriTL || currCell == Square.Dot){
                angles[index] += getAngle(3, bl_cell);
                // Check br to add if possible...what about tr???
                var br_cell = cellTypes[2];
                if (br_cell == Square.TriTR){
                    angles[index] += getAngle(2, br_cell);                   
                }
            }
        }               
        
        //console.log("index = " + index + " ang = " + angles[index] + " cellInd = " + cellInd + " currCell = " + currCell);        
                
        if (currAccessible(cellInd, currCell) || !nextAccessible(nextInd, nextCell)){
            index = (index + 1) % 4;
        }
                
        cellInd = (cellInd + 1) % 4;
        counter++;           
    }   

    //console.log(angles);  

    for (var ang of angles){
        if (!isValidAngle(ang)){
            return false;
        }
    }
    
    return true;
}

function currAccessible(corner:number, curr:Square):boolean{
    
    var outcome = false;
    
    if (curr < Square.Dot) return true;    

    // Prev not accessible triangles.
    switch(corner){
        case 0:
            outcome = (curr == Square.TriBR || curr == Square.TriTR); 
            break; 
        case 1:
            outcome = (curr == Square.TriBR || curr == Square.TriBL); 
            break; 
        case 2:
            outcome = (curr == Square.TriBL || curr == Square.TriTL); 
            break; 
        case 3:
            outcome = (curr == Square.TriTL || curr == Square.TriTR); 
            break;
        default:
            outcome = false;                         
    }    
    return outcome;
}

// clockwise
function nextAccessible(corner:number, next:Square):boolean{
    var outcome = false;
    
    if (next == Square.Dot) return true;
    
    switch(corner){
        case 0:
            outcome = (next == Square.TriTL || next == Square.TriTR); 
            break; 
        case 1:
            outcome = (next == Square.TriBR || next == Square.TriTR); 
            break; 
        case 2:
            outcome = (next == Square.TriBL || next == Square.TriBR); 
            break; 
        case 3:
            outcome = (next == Square.TriTL || next == Square.TriBL); 
            break;
        default:
            outcome = false;                         
    }
    return outcome;
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

function checkBlackSquare(row:number, col:number, board:Square[][]):boolean {
    var type = board[row][col];
    //var b_len = board.length;
        
    var numRows = board.length;
    var numCols = board[0].length;
    
    // Not a black square with number
    if (type >= Square.Dot || type <= 1){
        return true; // Do not return any value. No check - no error.
    }

    var reqTriangles = blackSqNum(type);
    
    var leftCell = -1;
    var rightCell = -1;
    var topCell = -1;
    var bottomCell = -1;

    // All types surrounding cell.
    if (col >= 0) leftCell = board[row][col - 1];
    if (col < numCols) rightCell = board[row][col + 1];
    if (row - 1 >= 0) topCell = board[row - 1][col];
    if (row + 1 < numRows) bottomCell = board[row + 1][col];
        
    var counter = 0;    
        
    // Now check up to 4 adjacent cells for black triangles.
    if ((leftCell != -1) && (leftCell == Square.TriTR || leftCell == Square.TriBR)){
        counter += 1;
    }
    if ((rightCell != -1) && (rightCell == Square.TriBL || rightCell == Square.TriTL)){
        counter += 1;
    }
    if ((topCell != -1) && (topCell == Square.TriBL || leftCell == Square.TriBR)){
        counter += 1;
    }   
    if ((bottomCell != -1) && (bottomCell == Square.TriTL || bottomCell == Square.TriTR)){
        counter += 1;
    }    
    
    // Failed requirement.
    if (counter != reqTriangles){
        return false;
    }
        
    return true;
}

function checkBottomSide(cell1:number, cell2:number, checkAngle:(arg:number)=>boolean):boolean {
    
    // NOTE: angle w.r.t. to top centre point.
    var firstAngle = anglesTL[cell1];
    var secondAngle = anglesTR[cell2];
        
    if ((firstAngle > 0) && (cell1 == Square.TriTL || cell1 == Square.TriBL || cell1 == Square.Dot)){
        if (cell2 != Square.TriTL){
            firstAngle += secondAngle;
        }
    } 
    //console.log("firstAngle = " + firstAngle);
    
    if (!checkAngle(firstAngle)) return false;
    
    firstAngle =  anglesTL[cell1];    
    if ((secondAngle > 0) && (cell2 == Square.TriTR || cell2 == Square.TriBR || cell2 == Square.Dot)){
        if (cell1 != Square.TriTR){
            secondAngle += firstAngle;
        }
    }
    //console.log("secondAngle = " + secondAngle);
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
    //console.log("firstAngle = " + firstAngle);
    
    if (!checkAngle(firstAngle)) return false;

    firstAngle =  anglesTL[cell1]; // <-------   
    if ((secondAngle > 0) && (cell2 == Square.TriBR || cell2 == Square.TriBL || cell2 == Square.Dot)){
        if (cell1 != Square.TriBR){
            secondAngle += firstAngle;
        }
    }
    //console.log("secondAngle = " + secondAngle);
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
    //console.log("firstAngle = " + firstAngle);
    
    if (!checkAngle(firstAngle)) return false;
    
    firstAngle =  anglesTR[cell1]; // <-------   
    if ((secondAngle > 0) && (cell2 == Square.TriBR || cell2 == Square.TriBL || cell2 == Square.Dot)){
        if (cell1 != Square.TriBR){
            secondAngle += firstAngle;
        }
    }
    //console.log("secondAngle = " + secondAngle);

    return checkAngle(secondAngle);  
}

function checkTopSide(cell1:number, cell2:number, checkAngle:(arg:number)=>boolean):boolean {
    
    // NOTE: angle w.r.t. to top centre point.
    var firstAngle = anglesBL[cell1];
    var secondAngle = anglesBR[cell2];
        
    if ((firstAngle > 0) && (cell1 == Square.TriTL || cell1 == Square.TriBL || cell1 == Square.Dot)){
        if (cell2 != Square.TriBL){
            firstAngle += secondAngle;
        }
    } 
    //console.log("firstAngle = " + firstAngle);
    
    if (!checkAngle(firstAngle)) return false;

    firstAngle =  anglesBL[cell1];    
    if ((secondAngle > 0) && (cell2 == Square.TriTR || cell2 == Square.TriBR || cell2 == Square.Dot)){
        if (cell1 != Square.TriBR){
            secondAngle += firstAngle;
        }
    }
    //console.log("secondAngle = " + secondAngle);
    
    return checkAngle(secondAngle);   
}

function checkCorners(board: Square[][]):boolean{
    
    if (board == null) return false; // Do not entertain bull shit.
    
    // var b_len = board.length;
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

/************************************** AUX FUNCTIONS ***********************************************/

function max(a:number, b:number): number {
    return (a > b) ? a : b;   
}

function withinBounds(b_len: number, row: number, col: number): boolean {
    return (0 <= row && row < b_len) && (0 <= col && col < b_len);   
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

function maybeValidAngle(angle:number):boolean {
    return (angle > 45);
}