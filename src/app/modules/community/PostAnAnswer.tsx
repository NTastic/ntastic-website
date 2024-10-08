"use client";
import React, { useRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, TextField, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPLOAD_IMAGE, CREATE_ANSWER } from "@/graphql/qa";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";

const transition = React.forwardRef(function transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} timeout={500} {...props} />
});

interface PostAnAnswerProps {
    open: boolean;
    questionId: string;
    handleCloseAnswerDialog: () => void;
    refetchAnswer: () => void;
};

export default function PostAnAnswer(
    {
        open,
        questionId,
        handleCloseAnswerDialog,
        refetchAnswer
    }: PostAnAnswerProps
) {
    const [answerContent, setAnswerContent] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const [createAnswer] = useMutation(CREATE_ANSWER);

    const handleAnswerContext = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswerContent(event.target.value);
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const handleSubmit = async () => {
        setSubmitStatus(null);
        setSubmitError(null);
        let imageIds: string[] = [];

        if (!answerContent) {
            setSubmitError("Content is required!");
            return;
        }

        try {
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

            const { data: createResponse } = await createAnswer(
                { variables: { questionId: questionId, content: answerContent, imageIds: imageIds } }
            );

            if (createResponse) {
                setSubmitStatus("Submit successfully!");
                setAnswerContent(null);
                setSelectedFiles([]);
                setTimeout(() => handleCloseAnswerDialog(), 1000);
            }
        } catch (err) {
            setSubmitError((err as Error).message);
        } finally {
            setSubmitStatus(null);
            refetchAnswer();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseAnswerDialog}
            TransitionComponent={transition}
            keepMounted
            aria-describedby="slide-post-answer"
            sx={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
                transition: "transform 0.3s ease-in-out",
                "& .MuiPaper-root": {
                    minWidth: "500px",
                    padding: 3,
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }
            }}
        >
            <DialogTitle sx={{ width: "90%" }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseAnswerDialog}
                    aria-label="close"
                    sx={{
                        position: "absolute",
                        left: 15,
                        top: 15,
                        zIndex: 1
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: "center" }}>
                    Give your idea
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3
                }}
            >
                <TextField
                    variant="standard"
                    label="Answer"
                    placeholder="Your idea is ..."
                    multiline
                    minRows={8}
                    autoFocus
                    onChange={handleAnswerContext}
                    sx={{
                        width: "100%",
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
                    accept="*"
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
                        sx={{ borderRadius: "16px", textTransform: "none" }}
                    >
                        Upload Images
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ borderRadius: "16px", textTransform: "none" }}
                    >
                        Submit
                    </Button>
                </Box>
                {submitStatus && (
                    <Typography color="primary">
                        {submitStatus}
                    </Typography>
                )}
                {submitError && (
                    <Typography color="error">
                        {submitError}
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};