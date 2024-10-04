"use client";
import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { POST_TITLE } from "@/shared/constants/storage";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";

const AskQuestions: React.FC = () => {
    const router = useRouter();
    const [inputText, setInputText] = useState<string>("");

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleSubmit = () => {
        localStorage.setItem(POST_TITLE, inputText);
        router.push(RouteConfig.PostAQuestion.Path);
    };

    return (
        <Box
            sx={{
                width: "90%",
                minHeight: "300px",
                backgroundImage: "url(/images/uluru.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                padding: 3,
                mt: 2,
                mb: 2
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    width: "100%",
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "center",
                    mt: 2,
                    mb: 1
                }}
            >
                Ask Qeustions to NTastic
            </Typography>
            <TextField
                variant="outlined"
                label="Ask Something"
                placeholder="Which hot sauce from Coles or Woolies is the best?"
                multiline
                minRows={1}
                maxRows={3}
                onChange={handleTextFieldChange}
                sx={{
                    width: "80%",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    transition: "all 0.3s ease",
                    "&:focus-within": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }
                }}
            />
            <Button
                variant="contained"
                sx={{
                    width: "80%",
                    borderRadius: "16px",
                    backgroundColor: "rgb(242, 120, 75)",
                    textTransform: "none",
                    fontSize: "large",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-5px) scale(1.03)",
                        backgroundColor: "rgb(249, 200, 0)",
                    }
                }}
                onClick={() => handleSubmit()}
            >
                Ask NTastic
            </Button>
        </Box>
    );
};

export default AskQuestions;