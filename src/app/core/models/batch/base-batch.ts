export interface BaseBatch {
    batchId: string;
    clientId: number;
    created: string;
    batchName: string;
    numberOfImages: number;
    numberOfImagesUploading: number;
    numberOfImagesProcessing: number;
    numberOfImagesDone: number;
    numberOfImagesTouchUpQueue: number;
    numberOfImagesReadyToDownload: number;
    numberOfImagesDownloaded: number;
    numberOfImagesAutomaticallyRemoved: number;
}
