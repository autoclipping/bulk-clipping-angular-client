import { Injectable } from '@angular/core';
import { Batch } from '../models';
import { BatchService, ImageStatusService } from '../services';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import Timer = NodeJS.Timer;

@Injectable({
    providedIn: 'root'
})
export class BatchManager {
    batch: Batch;
    previousBatch: Batch;
    batchChange = new BehaviorSubject<Batch>(this.batch);
    private onCall = false;

    // TODO: Refactor continuous update logic into reusable service/class
    private interval: Timer;
    private timeout: Timer;
    private updateInterval = environment.batchUpdateInterval * 1000;
    private updateDuration = environment.updateDuration * 1000;

    constructor(private batchService: BatchService) {}

    /**
     * Wrapper function to get batch id
     */
    getId(): string {
        return this.batch.batchId;
    }

    /**
     * Reloads given batch or given batch and selects it, returns Observable to attach logic to
     * NB! subscribe must be called on returned result to start execution
     * @param id string if not given, loads active batch, if id given, loads given batch and sets it as active batch
     * @return Observable batch
     */
    load(id = ''): Observable<Batch> {
        this.onCall = true;
        let changeBatch = true;
        if (id === '') {
            id = this.batch.batchId;
            changeBatch = false;
        }

        return this.batchService.getBatch(id)
            .pipe(tap((batch: Batch) => this.handleResponse(batch, changeBatch)));
    }

    /**
     * Wrapper function to call load and execute
     * @param id of batch to load or none to reload current batch
     */
    reload(id = ''): void {
        this.load(id)
            .subscribe();
    }

    /**
     * Returns true if batch load also changed batch
     */
    hasBatchChanged(): boolean {
        return this.batch && this.previousBatch && this.batch.batchId !== this.previousBatch.batchId;
    }

    /**
     * Wrapper function to check if batch has images that are still uploading or processing
     * @param batch Batch
     * @return boolean
     */
    isInProgressBatch = (batch): boolean => {
        const statuses = ImageStatusService.getFileProcessingAndUploadingStatuses();

        return batch.batchImages.some(image => statuses.includes(image.status));
    };

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

    hasDownloadableImages(): boolean {
        const statuses = ImageStatusService.getDownloadStatuses();

        return this.batch.batchImages.some(image => statuses.includes(image.status));
    }

    /**
     * Handles batch response
     * @param batch Batch
     * @param change boolean
     */
    private handleResponse(batch: Batch, change = false): void {
        if (change) {
            if (this.isInProgressBatch(batch)) {
                this.startContinuousReload();
            } else {
                this.stopContinuousReload();
            }
        }
        // check if active batch is updated or active batch is being changed
        if (change || !this.batch || this.batch.batchId === batch.batchId) {
            if (this.batch) {
                this.previousBatch = {...this.batch};
            }
            this.batch = batch;
        }

        // fire batchChange event
        this.batchChange.next(batch);
        this.onCall = false;
    }
}
