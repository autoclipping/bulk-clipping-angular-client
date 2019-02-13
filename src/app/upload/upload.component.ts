import { Component } from '@angular/core';
import { BatchService, MojoService, PaymentModalService, ThumbnailPreviewService, UploadService } from '../core/services';
import { environment } from '../../environments/environment';
import { BatchManager } from '../core/manager/batch-manager';
import { BatchesManager } from '../core/manager/batches-manager';
@Component({
    selector: 'ac-upload',
    template: `
        <div class="ac-patch-upload">
            <input class="hidden" type="file" (change)="uploadHandler($event)" accept="image/*" multiple #fileInput>
            <a *ngIf="this.mojoService.mojo" type="button" (click)="fileInput.click()" class="ac-up-down-btn m-upload">
                <div class="ac-up-down-btn-anim">
                <span></span>
                <span></span>
                <span></span>
                </div>
                <span class="ac-up-down-btn-title">Upload images</span>
            </a>
            <a *ngIf="!this.mojoService.mojo" type="button"
               (click)="paymentModalService.open()" class="ac-up-down-btn m-upload">
                <div class="ac-up-down-btn-anim"></div>
                <span class="ac-up-down-btn-title">Upload images</span>
            </a>
        </div>
        <ac-ok-notification-modal
            *ngIf="showNotification"
            [message]="notificationMessage"
            [type]="notificationType"
            (confirm)="closeNotification()"
        ></ac-ok-notification-modal>
    `
})
export class UploadComponent {
    showNotification: boolean;
    notificationMessage: string;
    notificationType: string;
    batchSize = environment.batchSize;
    uploadLimit = environment.uploadLimit;

    constructor(
        private uploadService: UploadService,
        private thumbnailPreviewService: ThumbnailPreviewService,
        private batchService: BatchService,
        private batchManager: BatchManager,
        private batchesManager: BatchesManager,
        public paymentModalService: PaymentModalService,
        public mojoService: MojoService
    ) {}

    /**
     * If more files than fits to active batch creates batch and uploads there
     * @param event that contains all files
     */
    uploadHandler(event): void {
        // trigger upload event
        this.uploadService.triggerUpload();
        let files: Array<File> = Array.from(event.target.files);
        if (files.length > this.uploadLimit) {
            this.notificationMessage = `The upload limit is ${this.uploadLimit} images. You have selected ${files.length} images.`;
            this.showNotification = true;
            this.notificationType = "error"
            return;
        }

        files = this.handleExistingBatch(files);
        while (files.length) {
            const batchImages = files.splice(0, this.batchSize);
            this.batchService.createBatch()
                .subscribe(batch => {
                    this.uploadAndPreview(batch.batchId, batchImages, files.length === 0);
                    this.notificationMessage = `We created a new batch named "${batch.name}" for ${batchImages.length} images`;
                    this.showNotification = true;
                    this.notificationType = "ok"
                });
        }

        // start continuous reload of batches
        this.batchesManager.startContinuousReload();

    }

    /**
     * Fills out current batch with images if possible and returns remaining files
     * @param files array that contains all files
     */
    handleExistingBatch(files: Array<File>): Array<File> {
        if (!this.batchManager.batch) {
            return files;
        }
        const amount = this.batchSize - this.batchManager.batch.numberOfImages;
        if (files.length <= amount) {
            this.uploadAndPreview(this.batchManager.getId(), files, true);

            return [];
        }
        const missingImages = files.splice(0, amount);
        this.uploadAndPreview(this.batchManager.getId(), missingImages, false);

        return files;
    }

    uploadAndPreview(batchId: string, files: Array<File>, isLastBatch: boolean): void {
        if (isLastBatch) {
            this.batchManager.load(batchId)
                .subscribe(() => {
                    this.thumbnailPreviewService.addBatchImagesToPreview(batchId, files)
                        .subscribe(
                            imagePreview => {
                                this.batchManager.batch.batchImages.push(imagePreview);
                                this.batchManager.batchChange.next(this.batchManager.batch);
                            },
                            // tslint:disable-next-line:no-empty
                            () => {},
                            // we start uploading last batch after thumbnails are generated to show user progress faster
                            () => {
                                this.uploadService.convertAndUploadImages(batchId, files);
                                this.batchManager.startContinuousReload();
                            }
                        );
                });
        } else {
            this.uploadService.convertAndUploadImages(batchId, files);
        }
    }

    closeNotification(): void {
        this.showNotification = false;
    }
}
