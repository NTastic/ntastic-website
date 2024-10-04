"use client";
import React, { useRef, useState } from "react";
import { Box, IconButton, Typography, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { RouteConfig } from "@/routes/route";
import { POST_TITLE } from "@/shared/constants/storage";
import { useForm } from "react-hook-form";
import SelectTags from "./SelectTags";
import { UPLOAD_IMAGE, CREATE_QUESTION } from "@/graphql/qa";
import { useMutation } from "@apollo/client";
import UploadIcon from "@mui/icons-material/Upload";

type PostValues = {
    title: string;
    content: string;
};

const PostAQuestion: React.FC = () => {
    const router = useRouter();
    const postTitle = typeof window !== "undefined" ? localStorage.getItem(POST_TITLE) : "";
    console.log("postTitle: ", postTitle);
    const { register, getValues, handleSubmit } = useForm<PostValues>({
        defaultValues: {
            title: postTitle || "",
            content: ""
        }
    });
    const [tags, setTags] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [openTagsSelection, setOpenTagsSelection] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const [createQuestion] = useMutation(CREATE_QUESTION);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const handleSelectTag = (selectedTag: string) => {
        if (!tags.includes(selectedTag)) {
            setTags((prevList) => [...prevList, selectedTag]);
        } else {
            setTags((prevList) => prevList.filter((tag) => tag !== selectedTag));
        }
    };

    const handleOpenTagsSelection = () => setOpenTagsSelection(true);
    const handleCloseTagsSelection = () => setOpenTagsSelection(false);

    const onSubmit = async (data: PostValues) => {
        setSubmitStatus(null);
        setSubmitError(null);
        let imageIds: string[] = [];

        if (tags.length === 0) {
            setSubmitError("At least 1 tag is required!");
        }
        if (data.title.length === 0) {
            setSubmitError("Title is required!");
        }
        try {
            if (selectedFiles) {
                for (const file of selectedFiles) {
                    const { data: uploadResponse } = await uploadImage({ variables: { file: file } });
                    imageIds.push(uploadResponse.uploadImage.id);
                }
                console.log("imageIds: ", imageIds);
            }
            const { data: createResponse } = await createQuestion(
                { variables: { title: data.title, content: data.content, imageIds: imageIds } }
            );
            if (createResponse) {
                setSubmitStatus("Submit successfully!");
                setTimeout(() => {router.push(RouteConfig.Community.Path)}, 1000);
            }
        } catch (error) {
            setSubmitError((error as Error).message);
        }
    };

    return (
        <Box
            sx={{
                width: "90%",
                minWidth: 350,
                maxWidth: 800,
                height: "100%",
                overflow: "auto",
                padding: 3,
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
                    margin: { xs: 1, md: 0 }
                }}
            >
                <Box display="flex" sx={{ width: "100%", alignItems: "center", mb: 2 }}>
                    <IconButton
                        size='large'
                        edge='start'
                        onClick={() => { router.push(RouteConfig.Community.Path) }}
                        sx={{ mr: 1 }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Community
                    </Typography>
                    <Button
                        type="submit"
                        sx={{
                            fontSize: "large",
                            fontWeight: "bold",
                            color: "orange",
                            textTransform: "none",
                            borderRadius: "16px",
                            transition: "all 0.5s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "rgba(30, 80, 255, 0.5)"
                            }
                        }}
                    >
                        Ask
                    </Button>
                </Box>
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
                <input
                    type="file"
                    multiple
                    onChange={handleFilesChange}
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 2
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={triggerFileInput}
                        startIcon={<UploadIcon />}
                        sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                        Upload Images
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: "60%",
                            borderRadius: "16px",
                            backgroundColor: "#ccc",
                            textTransform: "none",
                            color: "#333",
                            transition: "all 0.5s ease",
                            "&:hover": {
                                backgroundColor: "#b3b",
                                color: "#ddd",
                                transform: "translateY(-5px)"
                            }
                        }}
                        onClick={() => handleOpenTagsSelection()}
                    >
                        + Add Tags to the question
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
            <SelectTags
                open={openTagsSelection}
                tags={tags}
                handleSelectTag={handleSelectTag}
                handleCloseTagsSelection={handleCloseTagsSelection}
            />
        </Box>
    );
};

export default PostAQuestion;