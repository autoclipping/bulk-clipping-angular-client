import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import.guard';
import { HttpTokenInterceptor } from './interceptors';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    AmazonService,
    ApiService,
    BatchDownloadService,
    BatchService,
    DotService,
    FileService,
    ImageService,
    ImageStatusService,
    MojoService,
    PaymentModalService,
    ThumbnailPreviewService,
    TokenService,
    UploadService
} from './services';
import { BatchManager } from './manager/batch-manager';
import { BatchesManager } from './manager/batches-manager';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
        TokenService,
        BatchService,
        ApiService,
        ImageService,
        UploadService,
        ThumbnailPreviewService,
        AmazonService,
        FileService,
        DotService,
        ImageStatusService,
        BatchDownloadService,
        MojoService,
        PaymentModalService,
        BatchManager,
        BatchesManager
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throwIfAlreadyLoaded(parentModule, 'CoreModule');
        }
    }
}
