"use client";
import React, { useRef, useState } from "react";
import { Box, IconButton, Typography, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { RouteConfig } from "@/routes/route";
import { POST_TITLE } from "@/shared/constants/storage";
import { useForm } from "react-hook-form";
import { UPLOAD_IMAGE, CREATE_QUESTION } from "@/graphql/qa";
import { useMutation } from "@apollo/client";
import UploadIcon from "@mui/icons-material/Upload";
import { SpinningHourglass } from "@/utils/Animations";
import { compressImage } from "@/utils/CompressFile";
import DisplayImages from "@/utils/DisplayImages";
import { isSmallScreen } from "@/utils/IsSmallScreen";

type PostValues = {
    title: string;
    content: string;
};

const PostAQuestion: React.FC = () => {
    const router = useRouter();
    const isSmall = isSmallScreen();
    const postTitle = typeof window !== "undefined" ? localStorage.getItem(POST_TITLE) : "";
    const { register, getValues, handleSubmit, reset: resetForm } = useForm<PostValues>({
        defaultValues: {
            title: postTitle || "",
            content: ""
        }
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedFileUrls, setSelectedFileUrls] = useState<string[]>([]);
    const MAX_FILES = 6;
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const [createQuestion] = useMutation(CREATE_QUESTION);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files: File[] = Array.from(event.target.files || []);
        if (files.length + selectedFiles.length > MAX_FILES) {
            alert(`You can only upload a maximum of ${MAX_FILES} photos.`);
            return;
        }
        const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
        setSelectedFiles(compressedFiles);
        const fileUrls = await Promise.all(compressedFiles.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        }));
        setSelectedFileUrls(fileUrls);
    };

    const onSubmit = async (data: PostValues) => {
        setIsLoading(true);
        setSubmitStatus(null);
        setSubmitError(null);
        let imageIds: string[] = [];

        try {
            if (data.title.length === 0) {
                throw new Error("Title is required!");
            }

            if (selectedFiles.length) {
                for (const file of selectedFiles) {
                    const { data: uploadResponse } = await uploadImage({
                        variables: { file: file }
                    });

                    if (uploadResponse && uploadResponse.uploadImage) {
                        imageIds.push(uploadResponse.uploadImage.id);
                    } else {
                        setSubmitError("Image upload failed.");
                        return;
                    }
                }
            }

            const { data: createResponse } = await createQuestion(
                { variables: { title: data.title, content: data.content, imageIds: imageIds } }
            );

            if (createResponse) {
                setSubmitStatus("Submit successfully!");
                resetForm();
                setSelectedFiles([]);
                setTimeout(() => {
                    setSubmitStatus(null);
                    setSubmitError(null);
                    router.push(RouteConfig.Community.Path);
                }, 1000);
            }
        } catch (error) {
            setSubmitError((error as Error).message);
        } finally {
            setIsLoading(false);
            localStorage.removeItem(POST_TITLE);
        }
    };

    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                height: "100%",
                overflow: "auto",
                padding: isSmall ? 1 : 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box display="flex" sx={{ width: "100%", alignItems: "center", mb: 2 }}>
                    <IconButton
                        size='large'
                        edge='start'
                        onClick={() => { router.back(); }}
                        sx={{ mr: 1 }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Community
                    </Typography>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        endIcon={isLoading ? <SpinningHourglass /> : null}
                        sx={{
                            fontSize: "large",
                            fontWeight: "bold",
                            color: "orange",
                            textTransform: "none",
                            borderRadius: "16px",
                            transition: "all 0.5s ease",
                            "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "rgba(30, 80, 255, 0.5)"
                            }
                        }}
                    >
                        {isLoading ? `Asking...` : `Ask`}
                    </Button>
                </Box>
                <Box
                    width="95%"
                    display="flex"
                    flexDirection="column"
                    paddingLeft={1}
                    paddingRight={1}
                >
                    <TextField
                        variant="standard"
                        label="Title"
                        {...register("title")}
                        placeholder="The Title of the Question (Mandatory)"
                        defaultValue={getValues("title")}
                        multiline
                    />
                    <TextField
                        variant="standard"
                        label="Content"
                        {...register("content")}
                        placeholder="The Description of the Question (Mandatory)"
                        multiline
                        minRows={8}
                        sx={{
                            flexGrow: 1,
                            "& .MuiInput-underline:before": {
                                borderBottom: "none",
                            },
                            "& .MuiInput-underline:hover:before": {
                                borderBottom: "none",
                            },
                            "& .MuiInput-underline:after": {
                                borderBottom: "none",
                            },
                        }}
                    />
                    {selectedFileUrls.length > 0 && (
                        <Box mb={2}>
                            <DisplayImages images={selectedFileUrls} height={300} />
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        width: "95%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 2
                    }}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFilesChange}
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                    />
                    <Button
                        variant="outlined"
                        disabled={isLoading}
                        onClick={triggerFileInput}
                        startIcon={<UploadIcon />}
                        sx={{ borderRadius: "16px", textTransform: "none" }}
                    >
                        Upload Images
                    </Button>
                </Box>
                {submitStatus && (
                    <Typography
                        variant="body1"
                        color="primary"
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            mt: 2
                        }}
                    >
                        {submitStatus}
                    </Typography>
                )}
                {submitError && (
                    <Typography
                        variant="body1"
                        color="error"
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            mt: 2
                        }}
                    >
                        {submitError}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default PostAQuestion;