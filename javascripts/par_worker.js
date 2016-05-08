var ParallelWorker = (function () {
    function ParallelWorker() {
        this.busy = false;
        this.initWorker();
        this.totalWorkCount = 0;
        this.nextWork = 0;
        this.works = {};
    }
    ParallelWorker.prototype.submitWork = function (work, callback) {
        var workId = this.totalWorkCount++;
        this.works[workId] = { work: work, callback: callback };
        if (!this.busy) {
            this.busy = true;
            this.worker.postMessage({ work: work, workId: workId });
        }
    };
    ParallelWorker.prototype.getWorkCount = function () {
        if (this.busy) {
            return this.totalWorkCount - this.nextWork + 1;
        }
        else {
            return this.totalWorkCount - this.nextWork;
        }
    };
    ParallelWorker.prototype.kill = function () {
        this.worker.terminate();
    };
    ParallelWorker.prototype.initWorker = function () {
        var _this = this;
        this.worker = new Worker(ParallelWorker.workerScript);
        this.worker.onmessage = function (e) {
            _this.processResult(e.data.result, e.data.workId);
        };
    };
    ParallelWorker.prototype.processResult = function (result, workId) {
        var callback = this.works[workId].callback;
        callback(result);
        if (this.nextWork < this.totalWorkCount) {
            var work = this.works[this.nextWork].work;
            this.worker.postMessage({ work: work, workId: this.nextWork });
            this.nextWork++;
        }
        else {
            this.busy = false;
        }
    };
    ParallelWorker.workerScript = "javascripts/worker_script.js";
    return ParallelWorker;
}());
