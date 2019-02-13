import { ImageStatusEnum } from '../../../../shared/enums/image-status.enum';

export interface BatchViewImage {
    imageId: string;
    fileName: string;
    thumbUrl: string;
    previewUrl: string;
    touchUpUrl: string;
    warning: string;
    status: ImageStatusEnum;

}
