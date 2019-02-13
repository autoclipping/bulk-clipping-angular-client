import { Component, Input } from '@angular/core';

@Component({
    selector: 'ac-progress',
    template: `
        <div class="ac-patch-download-progress" *ngIf="showProgress">
            <div class="ac-patch-download-progress-main">
                <div class="ac-patch-download-progress-main-bar">
                    <span [style.width.%]="progress"></span>
                </div>
            </div>
        </div>
    `
})
export class ProgressComponent {
    @Input() progress: number;
    showProgress = false;

    /**
     * Shows progress bar
     */
    start(): void {
        this.progress = 0;
        this.showProgress = true;
    }
    /**
     * Sets progress to max and hides progress bar after a short delay
     */
    finish(): void {
        this.progress = 100;
        setTimeout(() => {
            this.showProgress = false;
        }, 1500);
    }
}
