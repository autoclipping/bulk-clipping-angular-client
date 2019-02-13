import { Component, OnInit } from '@angular/core';
import { BatchTabEnum } from '../shared/enums/batch-tab-enum';
import { PaymentModalService } from '../core/services';
import { BatchManager } from '../core/manager/batch-manager';

@Component({
    selector: 'ac-batch-navigation',
    template: `
        <div class="ac-patches-filter">
            <ul class="ac-patches-filter-list">
                <li class="ac-patches-filter-list-item">
                    <a class="ac-patches-filter-list-item-btn js-ac-patches-filter-item m-removed"
                       (click)="this.selectTab(this.batchTabEnum.AUTOMATICALLY_REMOVED)"
                       [class.m-active]="selectedTab === this.batchTabEnum.AUTOMATICALLY_REMOVED"
                    >Automatically removed <span> ({{ batchManager.batch.numberOfImagesAutomaticallyRemoved }})</span></a>
                </li>
                <li class="ac-patches-filter-list-item">
                    <a class="ac-patches-filter-list-item-btn js-ac-patches-filter-item m-queue m-active"
                       (click)="this.selectTab(this.batchTabEnum.TOUCH_UP_QUEUE)"
                       [class.m-active]="selectedTab === this.batchTabEnum.TOUCH_UP_QUEUE || imageMovedTouchUp"
                    >Touch up queue <span>({{ batchManager.batch.numberOfImagesTouchUpQueue }})</span></a>
                </li>
                <li class="ac-patches-filter-list-item">
                    <a class="ac-patches-filter-list-item-btn js-ac-patches-filter-item m-download"
                       (click)="this.selectTab(this.batchTabEnum.READY_TO_DOWNLOAD)"
                       [class.m-active]="selectedTab === this.batchTabEnum.READY_TO_DOWNLOAD || imageMovedDownload"
                    >Ready to download<span>({{ batchManager.batch.numberOfImagesReadyToDownload }})</span></a>
                </li>
            </ul>
        </div>

        <ac-batch [selectedTab]="selectedTab"></ac-batch>
    `
})
export class BatchNavigationComponent implements OnInit {
    selectedTab: string;
    batchTabEnum = BatchTabEnum;
    imageMovedDownload: boolean;
    imageMovedTouchUp: boolean;
    hasModalOpened: boolean;

    constructor(
        public paymentModalService: PaymentModalService,
        public batchManager: BatchManager
    ) {}

    ngOnInit(): void {
        this.selectedTab = this.batchTabEnum.AUTOMATICALLY_REMOVED;
        this.batchManager.batchChange.subscribe(batch => {
            if (!this.batchManager.previousBatch) {
                return;
            }

            if (this.batchManager.hasBatchChanged()) {
                this.hasModalOpened = false;
            } else {
                if (this.batchManager.previousBatch.numberOfImagesReadyToDownload !== batch.numberOfImagesReadyToDownload) {
                    this.blink(this.batchTabEnum.TOUCH_UP_QUEUE);
                }
                // makes tab blink when images are added
                if (this.batchManager.previousBatch.numberOfImagesTouchUpQueue !== batch.numberOfImagesTouchUpQueue) {
                    this.blink(this.batchTabEnum.READY_TO_DOWNLOAD);
                }

                // selects Automatically removed tab when images are added
                if (batch.batchImages.length > this.batchManager.previousBatch.batchImages.length
                    && batch.batchId === this.batchManager.previousBatch.batchId
                ) {
                    this.selectTab(this.batchTabEnum.AUTOMATICALLY_REMOVED);
                }
            }

            // TODO MOVE THIS AWAY FROM HERE
            this.openPaymentModal();
        });
    }

    selectTab(tabId: string): void {
        this.selectedTab = tabId;
    }

    blink(tab): void {
        if (tab === this.batchTabEnum.TOUCH_UP_QUEUE) {
            this.imageMovedDownload = true;
            setTimeout(() => this.imageMovedDownload = false , 1000);
        } else {
            this.imageMovedTouchUp = true;
            setTimeout(() => this.imageMovedTouchUp = false , 1000);
        }
    }

    openPaymentModal(): void {
        const warning = this.batchManager.batch.batchImages.filter(image => image.warning);
        if (warning.length && !this.hasModalOpened) {
            this.hasModalOpened = true;
            this.paymentModalService.open(warning.length);
        }
    }
}
