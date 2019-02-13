import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BatchImage } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    path = '/batch/:batchId/image';
    batchImagePath = `${this.path}/:imageId`;
    downloadPath = `${this.batchImagePath}/download?format=png`;
    private maxSize = environment.imageMaxSize;
    private quality = environment.imageQuality;

    /**
     * If the area of the image is larger than this.maxSize in 
     * pixels and needs to be resampled, returns the resampled
     * width and height of image as a tuple that retains the
     * original's aspect ratio while width*height == this.maxSize - epsilon
     * where epsilon is the error produced by floating point arithmetics
     * If the area of the image in pixels is less than 
     * this.maxSize, returns the original size of the image as a tuple
     * @param image to resize
     */
    getConvertedSize(image: HTMLImageElement): [number, number] {
        const area = image.width*image.height;
        if (area > this.maxSize) {
            const ratio = image.width / image.height
            // Using floor here to ensure that floating point arithmetics err to the negative side
            const newWidth = Math.floor(Math.sqrt(this.maxSize*ratio)) 
            const newHeight = Math.floor(Math.sqrt(this.maxSize/ratio))

            return [newWidth, newHeight]
        } else {
            return [image.width, image.height]
        }
    }

    constructor(
        private apiService: ApiService
    ) {}

    /**
     * Converts image to jpeg, reduces quality to this.quality and resizes to max this.maxSize
     * @param image to convert and resize
     */
    convertAndResizeImage(image): Promise<Blob> {
        return new Promise(resolve => {
            const wrapper = document.getElementById('canvas-wrapper') as HTMLCanvasElement;
            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            wrapper.appendChild(canvas);
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.src = (e.target as FileReader).result.toString();
                img.onload = () => {
                    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                    const convertedSize = this.getConvertedSize(img);
                    canvas.width = convertedSize[0];
                    canvas.height = convertedSize[1];
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => {
                        wrapper.removeChild(canvas);
                        resolve(blob);
                    }, 'image/jpeg', this.quality);
                };
            };
            reader.readAsDataURL(image);
        });
    }

    /**
     * Adds image to given batch
     * @param batchId id of batch to add
     * @param name of image to add
     */
    addToBatch(batchId: string, name: string): Observable<BatchImage> {
        return this.apiService.post(
            ApiService.getApiPath(this.path, {
                ':batchId': batchId
            }), {fileName: name});
    }

    deleteFromBatch(batchId: string, imageId: string): Observable<null> {
        return this.apiService.delete(
            ApiService.getApiPath(this.batchImagePath, {
                ':batchId': batchId,
                ':imageId': imageId
            }), undefined);
    }

    /**
     * API call to download a single image from active batch
     * @param imageId of image to download
     * @param batchId of image to download
     */
    download(imageId, batchId): Observable<{ downloadLink: string }> {
        return this.apiService.get(
            ApiService.getApiPath(this.downloadPath, {
                ':batchId': batchId,
                ':imageId': imageId
            }), undefined);
    }
}
