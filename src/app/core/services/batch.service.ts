import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BaseBatch, Batch, BatchIndex } from '../models';
import { map } from 'rxjs/operators';
import { ThumbnailPreviewService } from './thumbnail-preview.service';

@Injectable({
    providedIn: 'root'
})
export class BatchService {
    path = 'batch';

    constructor(
        private apiService: ApiService,
        private thumbnailPreviewService: ThumbnailPreviewService
    ) {}

    /**
     * Batches index api
     */
    getBatches(): Observable<BatchIndex> {
        return this.apiService
            .get(this.path)
            .pipe(map((batches: BatchIndex) => {
                // convert all fields that are suppose to be number to number
                batches.results.map((batch: BaseBatch) => this.mapBatchFields(batch));

                return batches;
            }));
    }

    /**
     * Batches view api
     * @param id string batch id
     */
    getBatch(id: string): Observable<Batch> {
        return this.apiService
            .get(`${this.path}/${encodeURIComponent(id)}`)
            .pipe(map((batch: Batch) => {
                if (this.thumbnailPreviewService.hasPreview(batch.batchId)) {
                    this.thumbnailPreviewService.mapPreviews(batch);
                }
                this.mapBatchFields(batch);
                batch.batchImages.sort(item => item.warning ? -1 : 0);

                return batch;
            }));
    }

    /**
     * Batch create api
     */
    createBatch(): Observable<{ name: string, batchId: string }> {
        return this.apiService.post(this.path, undefined);
    }

    private mapBatchFields = (batch: BaseBatch): void => {
        batch.numberOfImages = Number(batch.numberOfImages);
        batch.numberOfImagesProcessing = Number(batch.numberOfImagesProcessing);
        batch.numberOfImagesReadyToDownload = Number(batch.numberOfImagesReadyToDownload);
        batch.numberOfImagesDownloaded = Number(batch.numberOfImagesDownloaded);
        batch.numberOfImagesTouchUpQueue = Number(batch.numberOfImagesTouchUpQueue);
        batch.numberOfImagesDone = Number(batch.numberOfImagesDone);
        batch.numberOfImagesUploading = Number(batch.numberOfImagesUploading);
        batch.numberOfImagesAutomaticallyRemoved =
            batch.numberOfImagesDone
            + batch.numberOfImagesUploading
            + batch.numberOfImagesProcessing;
        batch.numberOfImagesReadyToDownload  =
            batch.numberOfImagesReadyToDownload
            + batch.numberOfImagesDownloaded;
    };
}
