/// <reference path="par_solver.ts" />

importScripts(
    "board.js",
    "solver.js",
    "par_solver.js",
    "solver_helper.js"
);

onmessage = function(e: MessageEvent): void {
    var message = {
        workId: e.data.workId,
        result: parSolveByGuessing(e.data.work)
    };
    postMessage(message);
}
