import { Injectable } from '@angular/core';
import { BaseBatch, BatchIndex } from '../models';
import { BatchService } from '../services';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import Timer = NodeJS.Timer;
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BatchesManager {
    batches: Array<BaseBatch>;
    batchesChange = new BehaviorSubject<Array<BaseBatch>>(this.batches);

    // TODO: Refactor continuous update logic into reusable service/class
    private interval: Timer;
    private timeout: Timer;
    private updateInterval = environment.batchUpdateInterval * 1000;
    private updateDuration = environment.updateDuration * 1000;

    constructor(
        private batchService: BatchService
    ) {}

    /**
     * Initializes batches load event and returns attached observable
     * NB! subscribe must be called in order to start execution
     * @return Observable that loads batches from server
     */
    load(): Observable<BatchIndex> {
        return this.batchService.getBatches()
            .pipe(tap((response: BatchIndex) => {
                this.batches = response.results;
                this.batchesChange.next(this.batches);
            }));
    }

    /**
     * Wrapper function to call load() and execute it
     */
    reload(): void {
        this.load()
            .subscribe();
    }

    /**
     * Start continuous update
     */
    startContinuousReload(): void {
        // stop any previous updates and start a new one
        this.stopContinuousReload();
        this.interval = setInterval(() => {
            this.reload();
        }, this.updateInterval);
        this.timeout = setTimeout(() => this.stopContinuousReload(), this.updateDuration);
    }

    /**
     * Stop continuous update
     */
    stopContinuousReload(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
}
