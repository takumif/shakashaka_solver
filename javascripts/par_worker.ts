class ParallelWorker {
    private static workerScript = "javascripts/worker_script.js";
    private workQueue: (() => any)[];
    private worker: Worker;
    private busy: boolean;
    private totalWorkCount: number;
    private callbacks: { [id: number]: (result: any) => void };
    
    constructor() {
        this.workQueue = [];
        this.busy = false;
        this.initWorker();
        this.totalWorkCount = 0;
        this.callbacks = {};
    }
    
    submitWork(work: any, callback: (result: any) => void): void {
        if (this.busy) {
            this.workQueue.push(work);
        } else {
            var workId = this.totalWorkCount++;
            this.callbacks[workId] = callback;
            this.worker.postMessage({ work: work, workId: workId });
        }
    }
    
    private initWorker(): void {
        this.worker = new Worker(ParallelWorker.workerScript);
        this.worker.onmessage = (e: MessageEvent): void => {
            console.log(e.data.workId);
            console.log(this.callbacks);
            var callback = this.callbacks[e.data.workId];
            callback(e.data.result);
        }
    }
}