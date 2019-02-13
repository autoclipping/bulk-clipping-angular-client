export interface BatchImage {
    imageId: string;
    key: string;
    bucket: string;
    uploadCreds: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken: string;
        expiration: number;
    };
}
