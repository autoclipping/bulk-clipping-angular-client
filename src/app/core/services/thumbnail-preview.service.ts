import { Injectable } from '@angular/core';
import { Batch, BatchViewImage } from '../models';
import { FileService } from './file.service';
import { ImageStatusEnum } from '../../shared/enums/image-status.enum';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
/**
 * This service is responsible for handling image previews
 */
export class ThumbnailPreviewService {
    previewImagesByBatches: { [batchId: string]: { [fileName: string]: BatchViewImage } } = {};

    /**
     * Returns observable that returns image batch thumbnail previews
     * @param batchId string
     * @param images Array
     */
    addBatchImagesToPreview(batchId: string, images: Array<File>): Observable<BatchViewImage> {
        this.previewImagesByBatches[batchId] = {};
        let pending = images.length;

        return new Observable(observer => {
            images.forEach(image => {
                const reader: FileReader = new FileReader();
                reader.onload = (e: any) => {
                    const fileName = FileService.stripExtension(image.name);
                    const preview = this.generateThumbnailPreview(FileService.stripExtension(image.name), e.target.result);
                    this.previewImagesByBatches[batchId][fileName] = preview;
                    observer.next(preview);
                    if (--pending <= 0) {
                        observer.complete();
                    }
                };
                reader.readAsDataURL(image);
            });
        });
    }

    /**
     * Returns an array of batch image thumbnail previews
     * @param batchId string
     */
    getBatchPreviews(batchId: string): Array<BatchViewImage> {
        return this.previewImagesByBatches[batchId] ? Object.values(this.previewImagesByBatches[batchId]) : [];
    }

    /**
     * Return boolean whether batch has any images that have previews or not
     */
    hasPreview(batchId: string): boolean {
        return this.previewImagesByBatches[batchId] !== undefined;
    }

    /**
     * Iterates over batch images and attaches thumbnail preview urls if batch does not have thumbnail from server
     * @param batch Batch
     */
    mapPreviews(batch: Batch): void {
        let noPreviews = true;
        this.getBatchPreviews(batch.batchId)
            .map(imagePreview => {
                const filteredImages = batch.batchImages
                    .filter(image =>  FileService.stripExtension(image.fileName) === imagePreview.fileName);
                if (!filteredImages.length) {
                   batch.batchImages.push(imagePreview);
                   noPreviews = false;
                } else {
                    const image = filteredImages[0];
                    if (image.thumbUrl) {
                        this.clearPreview(batch.batchId, FileService.stripExtension(image.fileName));
                    } else {
                        image.thumbUrl = imagePreview.thumbUrl;
                        noPreviews = false;
                    }
                }
            });
        if (noPreviews) {
            this.clearPreview(batch.batchId);
        }
    }

    /**
     * Generate image thumbnail preview object and returns it
     * TODO: refactor BatchViewImage interface into class to make creation easier
     * @param fileName string
     * @param thumbUrl string
     */
    private generateThumbnailPreview = (fileName: string, thumbUrl: string): BatchViewImage => ({
        warning: undefined,
        touchUpUrl: '',
        previewUrl: '',
        imageId: '',
        fileName,
        thumbUrl,
        status: ImageStatusEnum.STATUS_FILE_UPLOADING
    });

    /**
     * Deletes image thumbnail preview or batch depending on if fileName is given
     * @param batchId string
     * @param fileName string
     */
    private clearPreview(batchId: string, fileName?: string): void {
        if (fileName === undefined) {
            // tslint:disable-next-line:no-dynamic-delete
            delete this.previewImagesByBatches[batchId];
        } else {
            // tslint:disable-next-line:no-dynamic-delete
            delete this.previewImagesByBatches[batchId][fileName];
        }
    }
}
