import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ImageStatusEnum } from '../../shared/enums/image-status.enum';

@Injectable({
    providedIn: 'root'
})
export class ImageStatusService {
    path = 'batch/:batchId/image/:imageId';

    /**
     * Returns image statuses that are used for downloading
     */
    static getDownloadStatuses(): Array<ImageStatusEnum> {
        return [ImageStatusEnum.STATUS_FILE_READY_TO_DOWNLOAD, ImageStatusEnum.STATUS_FILE_DOWNLOADED];
    }

    static getFileProcessingAndUploadingStatuses(): Array<ImageStatusEnum> {
        return [ImageStatusEnum.STATUS_FILE_UPLOADING, ImageStatusEnum.STATUS_FILE_PROCESSING];
    }

    static getFileProcessingUploadingAndDoneStatuses(): Array<ImageStatusEnum> {
        return [ImageStatusEnum.STATUS_FILE_UPLOADING, ImageStatusEnum.STATUS_FILE_PROCESSING, ImageStatusEnum.STATUS_FILE_DONE];
    }
    constructor(
        private apiService: ApiService
    ) {}

    change(imageId, batchId, status): Observable<null> {
        return this.apiService.patch(
            ApiService.getApiPath(this.path, {
                ':batchId': batchId,
                ':imageId': imageId
         }), {status});
    }

}
