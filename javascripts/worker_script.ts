/// <reference path="par_solver.ts" />

importScripts(
    "board.js",
    "solver.js",
    "seq_solver.js",
    "solver_helper.js"
);

onmessage = function(e: MessageEvent): void {
    var message = {
        workId: e.data.workId,
        result: seqSolveByGuessing(e.data.work)
    };
    postMessage(message);
}
