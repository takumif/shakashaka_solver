class ParallelWorker {
    private static workerScript = "javascripts/worker_script.js";
    private worker: Worker;
    private busy: boolean;
    private totalWorkCount: number;
    private nextWork: number;
    private works: { [id: number]: { work: any, callback: (result: any) => void} };
    
    constructor() {
        this.busy = false;
        this.initWorker();
        this.totalWorkCount = 0;
        this.nextWork = 0;
        this.works = {};
    }
    
    submitWork(work: any, callback: (result: any) => void): void {
        var workId = this.totalWorkCount++;
        this.works[workId] = { work: work, callback: callback };
        if (!this.busy) {
            this.busy = true;
            this.worker.postMessage({ work: work, workId: workId });
        }
    }
    
    getWorkCount(): number {
        if (this.busy) {
            return this.totalWorkCount - this.nextWork + 1;
        } else {
            return this.totalWorkCount - this.nextWork;
        }
    }
    
    private initWorker(): void {
        this.worker = new Worker(ParallelWorker.workerScript);
        this.worker.onmessage = (e: MessageEvent): void => {
            this.processResult(e.data.result, e.data.workId);
        }
    }
    
    private processResult(result: any, workId: number) {
        var callback = this.works[workId].callback;
        callback(result);
        if (this.nextWork < this.totalWorkCount) {
            var work = this.works[this.nextWork].work;
            this.worker.postMessage({ work: work, workId: this.nextWork });
            this.nextWork++;
        } else {
            this.busy = false;
        }
    }
}