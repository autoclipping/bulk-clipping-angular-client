import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BatchViewImage } from '../core/models';
import { DotService, ImageService, ImageStatusService, ThumbnailPreviewService, UploadService } from '../core/services';
import { ImageStatusEnum } from '../shared/enums/image-status.enum';
import { BatchTabEnum } from '../shared/enums/batch-tab-enum';
import { BatchManager } from '../core/manager/batch-manager';
import { BatchesManager } from '../core/manager/batches-manager';

@Component({
    selector: 'ac-batch',
    template: `
        <div class="ac-patch-hgroup">
            <h2 class="ac-patch-hgroup-title">{{ batchManager.batch.batchName }}</h2>
            <ac-batch-download
                    *ngIf="selectedTab === batchTabEnum.READY_TO_DOWNLOAD"
                    [batchId]="batchManager.batch.batchId"
            ></ac-batch-download>
        </div>
        <div class="ac-patch-list">
            <ac-spinner *ngIf="showSpinner"></ac-spinner>
            <div *ngFor="let image of images" class="ac-patch-list-item js-patch-item">
                <div class="ac-patch-list-item-main js-patch-item-main">
                    <a (click)="confirmDelete(image.imageId)"
                       class="ac-patch-list-item-main-remove"
                    ><span>Remove</span></a>
                    <figure class="ac-patch-list-item-main-image">
                        <img *ngIf="image.thumbUrl" [src]="image.thumbUrl | safe: 'url'" alt=""/>
                    </figure>
                    <div class="ac-patch-list-item-main-message js-patch-item-message">
                        <span *ngIf="image.status===imageStatusEnum.STATUS_FILE_UPLOADING && !image.warning">
                            Uploading{{ dotService.dots }}</span>
                        <span *ngIf="image.status===imageStatusEnum.STATUS_FILE_PROCESSING">Processing{{ dotService.dots }}</span>
                        <span *ngIf="image.warning" class="out-of-credits">Out of credits</span>
                    </div>
                    <div class="ac-patch-list-item-main-options">
                        <a *ngIf="selectedTab !== batchTabEnum.READY_TO_DOWNLOAD" data-message="To download"
                           class="ac-patch-list-item-main-options-item js-patch-option"
                           (click)="changeStatus(image.imageId,imageStatusEnum.STATUS_FILE_READY_TO_DOWNLOAD)"
                        ><span>To download</span></a>
                        <a *ngIf="selectedTab === batchTabEnum.READY_TO_DOWNLOAD" data-message="To download"
                           class="ac-patch-list-item-main-options-item js-patch-option"
                           (click)="downloadImage(image.imageId)"
                        ><span>Download</span></a>
                        <a (click)="previewShow(image)"

                           class="ac-patch-list-item-main-options-item m-preview js-patch-preview"><span>Preview</span></a>
                        <a *ngIf="selectedTab === batchTabEnum.TOUCH_UP_QUEUE" data-message="To touch up"
                           class="ac-patch-list-item-main-options-item js-patch-option"
                           (click)="touchUp(image.touchUpUrl)"
                        ><span>Touch up</span></a>
                        <a *ngIf="selectedTab !== batchTabEnum.TOUCH_UP_QUEUE" data-message="To touch up"
                           class="ac-patch-list-item-main-options-item js-patch-option"
                           (click)="changeStatus(image.imageId, imageStatusEnum.STATUS_FILE_TOUCH_UP_QUEUE)"
                        ><span>To touch up</span></a>
                    </div>
                </div>
                <div class="ac-patch-list-item-title">{{ image.fileName }}</div>
            </div>
        </div>
        <div *ngIf="selectedTab === batchTabEnum.READY_TO_DOWNLOAD" class="ac-patch-upload">
            <ac-batch-download [batchId]="batchManager.batch.batchId"></ac-batch-download>
        </div>
        <ac-image-preview
                (hide)="previewHide()"
                [previewImage]="previewImage"
                *ngIf="show"
        ></ac-image-preview>
        <ac-notification-modal
                (cancel)="cancel()"
                (confirm)="deleteImage()"
                [message]="notificationMessage"
                *ngIf="notificationShow"
        ></ac-notification-modal>
    `
})
export class BatchComponent implements OnInit, OnChanges {
    @Input() selectedTab: string;
    imageStatusEnum = ImageStatusEnum;
    batchTabEnum = BatchTabEnum;
    previewImage: BatchViewImage;
    show: boolean;
    notificationShow: boolean;
    notificationMessage: string;
    images: Array<BatchViewImage>;
    showSpinner = false;
    private deleteImageId: string;

    constructor(
        private thumbnailPreviewService: ThumbnailPreviewService,
        private imageStatusService: ImageStatusService,
        private batchesManager: BatchesManager,
        public dotService: DotService,
        public imageService: ImageService,
        public batchManager: BatchManager,
        private uploadService: UploadService
    ) {}

    ngOnInit(): void {
        this.updateImages();
        this.batchManager.batchChange.subscribe(() =>  {
            this.updateImages();
            if (this.thumbnailPreviewService.hasPreview(this.batchManager.getId())) {
                this.showSpinner = false;
            }
        });
        this.uploadService.upload.subscribe(value => this.showSpinner = value);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateImages();
    }

    updateImages(): void {
        const statuses = this.getTabImageStatuses();
        this.images = this.batchManager.batch.batchImages.filter(image => {
            return statuses.includes(image.status);
        });
    }

    changeStatus(imageId, status): void {
        this.imageStatusService.change(imageId, this.batchManager.getId(), status)
            .subscribe(() => {
                this.batchManager.load()
                    .subscribe(() => this.batchesManager.reload());
            });
    }

    previewShow(image): void {
        this.previewImage = image;
        this.show = true;
    }

    previewHide(): void {
        this.show = false;
    }

    touchUp(touchUpUrl): void {
        window.open(touchUpUrl);
        this.batchManager.startContinuousReload();
    }

    deleteImage(): void {
        this.imageService.deleteFromBatch(this.batchManager.getId(), this.deleteImageId)
            .subscribe(() => this.batchManager.reload());
        this.notificationShow = false;
    }

    confirmDelete(imageId): void {
        this.notificationMessage = 'Are you sure you want to delete this image?';
        this.deleteImageId = imageId;
        this.notificationShow = true;
    }

    cancel(): void {
        this.notificationShow = false;
    }

    /**
     * Downloads a single image from batch
     * @param imageId of image to download
     */
    downloadImage(imageId: string): void {
        this.imageService.download(imageId, this.batchManager.getId())
            .subscribe(response => {
                window.location.href = `${response.downloadLink}`;
            });
    }

    getTabImageStatuses(): Array<string> {
        const tabId = this.selectedTab;
        if (tabId === this.batchTabEnum.TOUCH_UP_QUEUE) {
            return [ImageStatusEnum.STATUS_FILE_TOUCH_UP_QUEUE];
        } else if (tabId === this.batchTabEnum.READY_TO_DOWNLOAD) {
            return ImageStatusService.getDownloadStatuses();
        } else {
            return ImageStatusService.getFileProcessingUploadingAndDoneStatuses();
        }
    }
}
