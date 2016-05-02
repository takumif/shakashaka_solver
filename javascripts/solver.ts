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
                if (!mayBeAngle(subBoard)){
                    console.log("mayBeAngle check");
                    return false;
                }                                                       
                if (!checkSide(subBoard, numRows, numCols, row, col, maybeValidAngle)){
                    console.log("checkSide");
                    return false;
                }      
            }
            // Black squares with invalid side triangles. DO NOT consider number of triangles.   
            if (!blackSquareWithInvalidTriangle(row, col, board)) {
                console.log("black square");
                return false;            
            }
        }
    }  
    if (!checkCorners(board)) return false;
    return true;
}


function mayBeAngle(cellTypes:Square[]):boolean {
    
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
    
    if (numNonEmpty < 4) return true;
    // All non empty, do additional check.
    
    var len = subTriangles.length;

    var i = 0;
    var firstAngle = 0;
    while (i < 8){
        // reach the first "black tri."
        if (subTriangles[i] == true){
            break;
        }
        firstAngle += 1;
        i++;
    }
    
    var angle = 0;
    
    while (i < 8){
        if (subTriangles[i] == true){
            if (angle % 2 == 1){
                return false;
            } else {
                angle = 0;
            }
        } else {
            angle += 1;
        }
        i++;
    }
    
    if ((angle + firstAngle) % 2 == 1){
        return false;
    }
    
    return true;
}

/*****************************************************************/

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
                if (!isValidBlock(TL, TR, BL, BR)){
                    console.log("isValidBlock");
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
} /**/

function validBlock(cellTypes:Square[], checkAngle:(arg:number)=>boolean): boolean{
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
        if ((angles[index] + ang) <= 360){
            //if (index == 3) console.log("Print: ang = " + ang + " angles[index] = " + angles[index]);
            angles[index] += ang;         
        }         
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
        if (currAccessible(cellInd, currCell) || !nextAccessible(nextInd, nextCell)){
            index = (index + 1) % 4;
        }              
        cellInd = (cellInd + 1) % 4;
        counter++;           
    }   
    //console.log(angles);
    for (var ang of angles){
        if (!checkAngle(ang)){
            return false;
        }
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
    if (col >= 0) leftCell = board[row][col - 1];
    if (col < numCols) rightCell = board[row][col + 1];
    if (row - 1 >= 0) topCell = board[row - 1][col];
    if (row + 1 < numRows) bottomCell = board[row + 1][col];            
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
    if (counter != reqTriangles){
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
    if (type >= Square.Dot || type <= 1 || type <= Square.Black){
        return true; // Do not return any value. No check - no error.
    }
    var leftCell = -1;
    var rightCell = -1;
    var topCell = -1;
    var bottomCell = -1;
    // All types surrounding cell.
    if (col >= 0) leftCell = board[row][col - 1];
    if (col < numCols) rightCell = board[row][col + 1];
    if (row - 1 >= 0) topCell = board[row - 1][col];
    if (row + 1 < numRows) bottomCell = board[row + 1][col]; 
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

// Check validity for 2 by 2 block.
function isValidBlock(tl:number, tr:number, bl:number, br:number): boolean {
    
            
    // Check only inner dot in 2 by 2 block.
    
    var angles:Array<number> = new Array<number>();

    /****** CORNER 1 (TL) *******/    
    // Calc. angles surrounding inner dot.
    var sum1 = 0;
    sum1 += anglesTL[tl];
    // Only for one angle coming from TL portion.
    // Sum adjacent angles in clockwise fashion iff tl is top-left or bottom-right triangle.
    // (Not case tri), (triangles in case), (tri in adjacent case)
    if ((tl != Square.TriTR) && (tl == Square.TriTL || tl == Square.TriBL || tl == Square.Dot) && (tr == Square.TriBR || tr == Square.TriTR || tr == Square.Dot)){
        sum1 += anglesTR[tr];
        //console.log("--1.1--");
        if ((tr == Square.TriTR || tr == Square.Dot) && (br == Square.TriBL || br == Square.TriBR || br == Square.Dot)){
            sum1 += anglesBR[br];
            //console.log("--2.1--");
            if ((br == Square.TriBR || br == Square.Dot) && (bl == Square.TriBL || bl == Square.TriTL || bl == Square.Dot)){
                sum1 += anglesBL[bl];        
                //console.log("--3.1--");    
            }
        }
        
        // Initially started with a TL triangle or Dot.
        if ((sum1 < 360) && (tl == Square.TriTL || tl == Square.Dot) && (bl == Square.TriBR || bl == Square.Dot || bl == Square.TriBL)){
                //console.log("--4.1--");
                sum1 += anglesBL[bl];
        }
    } 

    //console.log("Clockwise: " + sum1);    

    var sum2 = 0;
    var repeats = 0;
    sum2 += anglesTL[tl];    
    if ((tl != Square.TriBL) && (tl == Square.TriTL || tl == Square.TriTR || tl == Square.Dot) && (bl == Square.TriBL || bl == Square.TriBR || bl == Square.Dot)){
        sum2 += anglesBL[bl];
       // console.log("--1.2--");
        if ((bl == Square.TriBL || bl == Square.Dot) && (br == Square.TriBR || br == Square.TriTR || br == Square.Dot)){
            sum2 += anglesBR[br];
            //console.log("--2.2--");
            if ((br == Square.TriBR || br == Square.Dot) && (tr == Square.TriTL || tr == Square.TriTR || tr == Square.Dot)){
                sum2 += anglesTR[tr]; 
                //console.log("--3.2--");
            }
        }
        // Initially started with a TL triangle or Dot.
        if ((sum1 < 360) && (tl == Square.TriTL || tl == Square.Dot) && (tr == Square.TriBR || tr == Square.Dot || tr == Square.TriTR)){
            sum2 += anglesTR[tr];
            //console.log("--4.2--");
        }
    }     
    
    //console.log("Anti-Clockwise: " + sum2);    

    // Add the larger angle during rotational travel.
    angles.push(max(sum1, sum2));
    //console.log("Corner 1 - Final angle: " + angles[0]);

    /********* END CORNER 1 ********/    


    /****** CORNER 2 (TR) *******/    

    // Calc. angles surrounding inner dot.
    sum1 = 0;
    sum1 += anglesTR[tr];    
    // (Not case tri), (triangles in case), (tri in adjacent case)
    if ((tr != Square.TriBR) && (tr == Square.TriTL || tr == Square.TriTR || tr == Square.Dot) && (br == Square.TriBR || br == Square.TriBL || br == Square.Dot)){
        sum1 += anglesBR[br];
        //console.log("--1.1--");
        if ((br == Square.TriBR || br == Square.Dot) && (bl == Square.TriBL || bl == Square.TriTL || bl == Square.Dot)){
            sum1 += anglesBL[bl];
            //console.log("--2.1--");
            if ((bl == Square.TriBR || bl == Square.Dot) && (tl == Square.TriTL || tl == Square.TriTR || tl == Square.Dot)){
                sum1 += anglesTL[tl];        
                //console.log("--3.1--");    
            }
        }
        
        // Initially started with a TL triangle or Dot.
        if ((sum1 < 360) && (tr == Square.TriTR || tr == Square.Dot) && (tl == Square.TriTL || tl == Square.Dot || tl == Square.TriBL)){
            //console.log("--4.1--");
            sum1 += anglesTL[tl];
        }
    } 

    //console.log("Clockwise: " + sum1);    

    sum2 = 0;
    var repeats = 0;
    sum2 += anglesTR[tr];    
    if ((tr != Square.TriTL) && (tr == Square.TriTR || tr == Square.TriBR || tr == Square.Dot) && (tl == Square.TriBL || tl == Square.TriTL || tl == Square.Dot)){
        sum2 += anglesTL[tl];
        //console.log("--1.2--");
        if ((tl == Square.TriTL || tl == Square.Dot) && (bl == Square.TriBL || bl == Square.TriBR || bl == Square.Dot)){
            sum2 += anglesBL[bl];
            //console.log("--2.2--");
            if ((bl == Square.TriBL || bl == Square.Dot) && (br == Square.TriBR || br == Square.TriTR || br == Square.Dot)){
                sum2 += anglesBR[br]; 
                //console.log("--3.2--");
            }
        }
        // Initially started with a TL triangle or Dot.
        if ((sum1 < 360) && (tr == Square.TriTR || tr == Square.Dot) && (br == Square.TriBL || br == Square.Dot || br == Square.TriBR)){
            sum2 += anglesBR[br];
            //console.log("--4.2--");
        }
    }     
    
    //console.log("Anti-Clockwise: " + sum2);    
    angles.push(max(sum1, sum2));
    //console.log("Corner 2 - Final angle: " + angles[1]);

    /********* END CORNER 2 ********/    

    /****** CORNER 3 (BL) *******/    

    var sum1 = 0;
    sum1 += anglesBL[bl];
    if ((bl != Square.TriTL) && (bl == Square.TriBR || bl == Square.TriBL || bl == Square.Dot) && (tl == Square.TriTR || tl == Square.TriTL || tl == Square.Dot)){
        sum1 += anglesTL[tl];
        //console.log("--1.1--");
        if ((tl == Square.TriTL || tl == Square.Dot) && (tr == Square.TriBR || tr == Square.TriTR || tr == Square.Dot)){
            sum1 += anglesTR[tr];
            //console.log("--2.1--");
            if ((tr == Square.TriTR || tr == Square.Dot) && (br == Square.TriBR || br == Square.TriBL || br == Square.Dot)){
                sum1 += anglesBR[br];        
                //console.log("--3.1--");    
            }
        }
        if ((sum1 < 360) && (bl == Square.TriBL || bl == Square.Dot) && (br == Square.TriBR || br == Square.Dot || br == Square.TriTR)){
                //console.log("--4.1--");
                sum1 += anglesBR[br];
        }
    } 
    //console.log("Clockwise: " + sum1);    
    var sum2 = 0;
    var repeats = 0;
    sum2 += anglesBL[bl];    
    if ((bl != Square.TriBR) && (bl == Square.TriTL || bl == Square.TriBL || bl == Square.Dot) && (br == Square.TriTR || br == Square.TriBR || br == Square.Dot)){
        sum2 += anglesBR[br];
        //console.log("--1.2--");
        if ((br == Square.TriBR || br == Square.Dot) && (tr == Square.TriTL || tr == Square.TriTR || tr == Square.Dot)){
            sum2 += anglesTR[tr];
            //console.log("--2.2--");
            if ((tr == Square.TriTR || tr == Square.Dot) && (tl == Square.TriTL || tl == Square.TriBL || tl == Square.Dot)){
                sum2 += anglesTL[tl]; 
                //console.log("--3.2--");
            }
        }
        // Initially started with a TL triangle or Dot.
        if ((sum1 < 360) && (bl == Square.TriBL || bl == Square.Dot) && (tl == Square.TriTL || tl == Square.Dot || tl == Square.TriTR)){
            sum2 += anglesTL[tl];
           // console.log("--4.2--");
        }
    }     
    //console.log("Anti-Clockwise: " + sum2);    
    // Add the larger angle during rotational travel.
    angles.push(max(sum1, sum2));
   // console.log("Corner 3 - Final angle: " + angles[2]);

    /********* END CORNER 3 ********/ 

    /****** CORNER 4 (BR) NOTE: I got the directions mixed up but still OK *******/    

    var sum1 = 0;
    sum1 += anglesBR[br];
    if ((br != Square.TriTR) && (br == Square.TriBL || br == Square.TriBR || br == Square.Dot) && (tr == Square.TriTR || tr == Square.TriTL || tr == Square.Dot)){
        sum1 += anglesTR[tr];
        //console.log("--1.1--");
        if ((tr == Square.TriTR || tr == Square.Dot) && (tl == Square.TriBL || tl == Square.TriTL || tl == Square.Dot)){
            sum1 += anglesTL[tl];
            //console.log("--2.1--");
            if ((tl == Square.TriTL || tl == Square.Dot) && (bl == Square.TriBR || bl == Square.TriBL || bl == Square.Dot)){
                sum1 += anglesBL[bl];        
                //console.log("--3.1--");    
            }
        }
        
        if ((sum1 < 360) && (br == Square.TriBR || br == Square.Dot) && (bl == Square.TriBL || bl == Square.Dot || bl == Square.TriTL)){
                //console.log("--4.1--");
                sum1 += anglesBL[bl];
        }
    } 

   // console.log("Anti-Clockwise: " + sum1);    

    var sum2 = 0;
    var repeats = 0;
    sum2 += anglesBR[br];    
    if ((br != Square.TriBL) && (br == Square.TriTR || br == Square.TriBR || br == Square.Dot) && (bl == Square.TriTL || bl == Square.TriBL || bl == Square.Dot)){
        sum2 += anglesBL[bl];
        //console.log("--1.2--");
        if ((bl == Square.TriBL || bl == Square.Dot) && (tl == Square.TriTL || tl == Square.TriTR || tl == Square.Dot)){
            sum2 += anglesTL[tl];
           // console.log("--2.2--");
            if ((tl == Square.TriTL || tl == Square.Dot) && (tr == Square.TriTR || tr == Square.TriBR || tr == Square.Dot)){
                sum2 += anglesTR[tr]; 
                //console.log("--3.2--");
            }
        }
        // Initially started with a TL triangle or Dot.
        if ((sum1 < 360) && (br == Square.TriBR || br == Square.Dot) && (tr == Square.TriTL || tr == Square.Dot || tr == Square.TriTR)){
            sum2 += anglesTR[tr];
            //console.log("--4.2--");
        }
    }     
    
    //console.log("Clockwise: " + sum2);    

    // Add the larger angle during rotational travel.
    angles.push(max(sum1, sum2));
    //console.log("Corner 4 - Final angle: " + angles[3]);

    /********* END CORNER 4 ********/ 

    //console.log("All angles : " + angles);

    // Do check for invalid angles.
    for (var a of angles){
        // Angle not found in valid angles.
        if (!(a == 0 || a == 90 || a == 180 || a == 360)){
            //console.log("Invalid");
            return false;
        }
    }
    
    // No invalid angle found.
    return true;
} /**/