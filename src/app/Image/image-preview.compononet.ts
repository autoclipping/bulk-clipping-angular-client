import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BatchViewImage } from '../core/models';

@Component({
    selector: 'ac-image-preview',
    template: `
        <div class="ac-patch-preview">
            <div class="ac-patch-preview-main">
                <a class="ac-patch-preview-main-close js-patch-preview-close" (click)="hide.emit()">
                    <span>Close</span></a>
                <figure class="ac-patch-preview-main-image">
                    <img [src]="previewImage.previewUrl | safe: 'url'" alt="">
                </figure><div class="ac-patch-preview-main-title">
                <span> {{ previewImage.fileName }} </span>
            </div>
            </div>
        </div>
    `
})
export class ImagePreviewComponent {
    @Input() previewImage: BatchViewImage;
    @Output() readonly hide = new EventEmitter();
}
