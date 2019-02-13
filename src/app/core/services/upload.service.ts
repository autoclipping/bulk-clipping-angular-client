import { Injectable } from '@angular/core';
import { BatchService } from './batch.service';
import { ThumbnailPreviewService } from './thumbnail-preview.service';
import { ImageService } from './image.service';
import { AmazonService } from './amazon.service';
import { FileService } from './file.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    /**
     *  Upload event witch can be subscribed to
     */
    upload = new BehaviorSubject<boolean>(false);
    constructor(
        private batchService: BatchService,
        private imageService: ImageService,
        private previewService: ThumbnailPreviewService,
        private amazonService: AmazonService
    ) {}

    /**
     * Triggers upload event which means user started image upload
     */
    triggerUpload(): void {
        this.upload.next(true);
    }

    /**
     * Converts given images to suitable format and uploads them
     */
    convertAndUploadImages(batchId: string, images: Array<File>): void {
        // iterate over all batch images, compress them, and upload to amazon
        images.forEach(image => {
            this.imageService.convertAndResizeImage(image)
                .then(convertedImage => {
                    // convert image to .jpg
                    const name = `${FileService.stripExtension(image.name)}.jpeg`;
                    const imageFile = new File([convertedImage], name, {type: 'image/jpeg'});
                    this.imageService.addToBatch(batchId, name)
                        .subscribe(batchImage => this.amazonService.upload(batchImage, imageFile));
                });

        });
    }
}
