"use client";
import { useMutation } from '@apollo/client';
import { UPLOAD_IMAGE } from "@/graphql/qa";

// Example of usage in a component
const ImageUploader: React.FC = () => {
    // Use the useMutation hook at the top level of the component
    const [uploadImageMutation] = useMutation(UPLOAD_IMAGE);

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await uploadImageMutation({ variables: { file: formData.get('file') } });
            return data.uploadImage.id; // Return the ID of the uploaded image
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error; // Rethrow the error for handling in the calling component
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            try {
                const imageId = await upload(file); // Call the upload function with the selected file
                console.log("Uploaded image ID:", imageId);
            } catch (error) {
                console.error("Upload failed:", error);
            }
        }
    };

    return (
        <input type="file" accept="image/*" onChange={handleFileChange} />
    );
};

export default ImageUploader;
