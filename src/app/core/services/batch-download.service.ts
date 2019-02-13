import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BatchDownloadService {
    path = 'batch/:batchId/download';
    constructor(
        private apiService: ApiService
    ) {}

    /**
     * Initiates creation of zip file to download images in API
     */
    createZip(batchId: string): Observable<null> {
        return this.apiService.post(ApiService.getApiPath(this.path, {
            ':batchId': batchId}), undefined);
    }

    getDownloadLink(batchId: string): Observable<null> {
        return this.apiService.get(ApiService.getApiPath(this.path, {
            ':batchId': batchId
        }));
    }
}
