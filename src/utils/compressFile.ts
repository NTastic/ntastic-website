import imageCompression from "browser-image-compression";

const compressionOptions = {
    maxSizeMB: 5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
};

export const compressImage = async (file: File) => {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
};