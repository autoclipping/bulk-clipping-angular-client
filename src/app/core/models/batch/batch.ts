import { BaseBatch } from './base-batch';
import { BatchViewImage } from './view/batch-view-image';

export interface Batch extends BaseBatch {
    batchImages: Array<BatchViewImage>;
    zipUploadBucket: string;
    zipUploadKey: string;
    uploadCredentials: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken: string;
        expiration: number;
    };
}
