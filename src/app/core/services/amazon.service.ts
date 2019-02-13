import { Injectable } from '@angular/core';
import { BatchImage } from '../models';
import { config, Credentials, S3 } from 'aws-sdk';

@Injectable({
    providedIn: 'root'
})
export class AmazonService {
    /**
     * Response for uploading image to amazon
     * @param batchImage BatchImage
     * @param image File
     */
    upload(batchImage: BatchImage, image: File): void {
        // configures the AWS service and initial authorization
        const credentials = this.getCredentials(batchImage);

        // configures the AWS service and initial authorization
        config.update({credentials});

        // new amazon service object
        const s3 = new S3({params: {Bucket: batchImage.bucket}});

        s3.upload({
            Bucket: batchImage.bucket,
            Key: batchImage.key,
            Body: image
        })
            .send();
    }

    /**
     * Returns aws config for current image
     * @param batchImage BatchImage
     */
    private getCredentials = (batchImage: BatchImage): Credentials => new Credentials(
        batchImage.uploadCreds.accessKeyId,
        batchImage.uploadCreds.secretAccessKey,
        batchImage.uploadCreds.sessionToken
    );
}
