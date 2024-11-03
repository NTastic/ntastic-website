"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { POST_TITLE, ACCESS_TOKEN } from "@/shared/constants/storage";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";
import { isSmallScreen } from "@/utils/IsSmallScreen";

const AskQuestions: React.FC = () => {
    const router = useRouter();
    const isSmall = isSmallScreen();
    const [inputText, setInputText] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [auth, setAuth] = React.useState<boolean>(false);

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleSubmit = () => {
        if (!inputText) {
            return;
        }
        if (!auth) {
            router.push(RouteConfig.Login.Path);
        } else {
            localStorage.setItem(POST_TITLE, inputText);
            router.push(RouteConfig.PostAQuestion.Path);
        }
    };

    useEffect(() => {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
        setAccessToken(accessToken);
    }, []);

    useEffect(() => {
        if (accessToken) {
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, [accessToken, auth]);

    return (
        <Box
            sx={{
                width: "90%",
                height: isSmall ? "200px" : "300px",
                backgroundColor: "rgba(153, 153, 255, 0.8)",
                backgroundImage: "url(https://i.postimg.cc/JnxsqvLh/uluru.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: "16px",
                overflowX: "hidden",
                overflowY: "hidden",
                padding: 3,
                mt: 1,
                mb: 1
            }}
        >
            <Typography
                variant={isSmall ? "h6" : "h3"}
                sx={{
                    width: "100%",
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "center",
                    mt: isSmall ? 1 : 2,
                    mb: 1
                }}
            >
                Ask Questions to NTastic
            </Typography>
            <TextField
                    variant="outlined"
                    label="Ask Something"
                    multiline
                    minRows={1}
                    maxRows={isSmall ? 2 : 3}
                    onChange={handleTextFieldChange}
                    sx={{
                        width: "80%",
                        borderRadius: "16px",
                        border: "none",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        mb: 1,
                        transition: "all 0.3s ease",
                        "&:focus-within": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                        }
                    }}
                    InputProps={{
                        sx: {
                            borderRadius: "16px",
                        }
                    }}
                    InputLabelProps={{
                        shrink: !!inputText
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
                disabled={inputText ? false : true}
            >
                Ask NTastic
            </Button>
        </Box>
    );
};

export default AskQuestions;