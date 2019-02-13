import { Component, Input, ViewChild } from '@angular/core';
import { BatchDownloadService } from '../core/services';
import { ProgressComponent } from '../shared/components/progress.component';
import { BatchManager } from '../core/manager/batch-manager';

@Component({
    selector: 'ac-batch-download',
    template: `
        <div class="ac-patch-hgroup-btn">
            <a type="button" (click)="prepareDownload()" class="ac-up-down-btn m-download">
                <div class="ac-up-down-btn-anim">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="ac-up-down-btn-title">Download all files (zip)</span>
            </a>
            <ac-progress [progress]="progress"></ac-progress>
        </div>
        <ac-ok-notification-modal
                *ngIf="showNotification"
                [message]="notificationMessage"
                [type]="notificationType"
                (confirm)="closeNotification()"
        ></ac-ok-notification-modal>
    `
})
export class BatchDownloadComponent {
    @Input() batchId: string;
    @ViewChild(ProgressComponent) progressComponent: ProgressComponent;
    progress: number;
    notificationMessage = 'There are no images to download';
    notificationType = 'error'
    showNotification: boolean;

    constructor(
        public batchDownloadService: BatchDownloadService,
        private batchManager: BatchManager
    ) {}

    /**
     * enables progress bar and initializes download zip creation and download
     */
    prepareDownload(): void {
        if (!this.batchManager.hasDownloadableImages()) {
            this.showNotification = true;

            return;
        }
        this.progressComponent.start();
        this.batchDownloadService.createZip(this.batchId)
            .subscribe(() => {
                const linkInterval = setInterval(() => {
                    this.batchDownloadService.getDownloadLink(this.batchId)
                        .subscribe((response: { zipLink: string, zipProgress: number }) => this.handleResponse(response, linkInterval));
                }, 1000);
            });
    }

    /**
     * if download zip is ready to download, downloads zip
     * if not reports zipping progress
     * @param response is response from api call (download link in this case)
     * @param linkInterval is used to break setInterval()
     */
    handleResponse(response, linkInterval): void {
        if (response.zipLink) {
            clearInterval(linkInterval);
            window.location.href = `${response.zipLink}`;
            this.progressComponent.finish();
        } else {
            this.progress = response.zipProgress * 100;
        }
    }

    closeNotification(): void {
        this.showNotification = false;
    }
}
