import { Component, OnInit } from '@angular/core';
import { BaseBatch } from '../core/models';
import { BatchService } from '../core/services';
import { BatchManager } from '../core/manager/batch-manager';
import { BatchesManager } from '../core/manager/batches-manager';

@Component({
    selector: 'ac-batch-list',
    template: `
        <div class="ac-patches">
            <h1 class="ac-patches-title">Batches:<a

                    class="ac-patches-title"
                    (click)="addNewBatch()"
            > + ADD NEW BATCH</a></h1>

            <div class="ac-paches-lists">
                <div *ngFor="let batches of chunkedBatches | paginate: {
                    itemsPerPage: offset,
                    currentPage: page
                }; first as firstChunk" class="ac-paches-list">
                    <div *ngFor="let batch of batches; first as firstBatch">
                        <a class="ac-paches-list-item"
                           [class.m-active]="batch?.batchId === batchManager.batch?.batchId
                                || !batchManager.batch && firstChunk && firstBatch"
                           [class.m-alert]="batch.numberOfImagesTouchUpQueue"
                           [attr.title]="batch.numberOfImagesTouchUpQueue ?
                                'Touch up needed (' + batch.numberOfImagesTouchUpQueue + ')' : ''"
                           (click)="batchManager.reload(batch.batchId)">
                            <div class="ac-paches-list-item-date">
                                <p><span>{{ batch.batchName }} ({{ batch.numberOfImages }})</span></p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <pagination-controls
                    *ngIf="chunkedBatches?.length > 4"
                    class="ac-patches-all-nav-item"
                    (pageChange)="changePage($event)"
            ></pagination-controls>
        </div>
    `
})

export class BatchListComponent implements OnInit {
    page = 1;
    offset = 4;
    chunkSize = 4;
    chunkedBatches: Array<Array<BaseBatch>>;

    constructor(
        private batchService: BatchService,
        private batchesManager: BatchesManager,
        public batchManager: BatchManager
    ) {}

    ngOnInit(): void {
        this.createChunks();
        this.batchesManager.batchesChange.subscribe(() => this.createChunks());
    }

    /**
     * Creates chunks of batches array used to display batches list as columns of 4, side by side
     */
    createChunks(): void {
        // do deep copy of array
        const batches: Array<BaseBatch> = this.batchesManager.batches.map(item => ({...item}));
        const results: Array<Array<BaseBatch>> = [];
        while (batches.length) {
            results.push(batches.splice(0, this.chunkSize));
        }
        this.chunkedBatches = results;
    }

    changePage(page): void {
        this.page = page;
    }

    addNewBatch(): void {
        this.batchService.createBatch()
            .subscribe(batch => {
                this.batchManager.reload(batch.batchId);
                this.batchesManager.reload();
            });
    }
}
