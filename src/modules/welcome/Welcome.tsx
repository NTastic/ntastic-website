"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";
import { Avatar, Box, Button, Card, Link, Typography } from "@mui/material";

const Welcome: React.FC = () => {
    const router = useRouter();

    return (
        <Card
            sx={{
                width: "100%",
                minWidth: 350,
                maxWidth: 800,
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
                mr: 1,
                ml: 1
            }}
        >
            <Box
                sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: 2,
                    padding: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "280px",
                        alignItems: "center"
                    }}
                >
                    <Avatar
                        src="https://i.postimg.cc/mkryN7K0/NTastic-icon.png"
                        sx={{ width: "160px", height: "160px", objectFit: "cover", backgroundPosition: "center" }}
                    />
                    <Box
                        sx={{
                            height: "70px",
                            width: "120px",
                            backgroundImage: "url(https://i.postimg.cc/c4HnDx6G/slogan.png)",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat"
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        mb: 2
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            width: "100%",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            textAlign: "start",
                        }}>
                        Welcome to NTastic
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            width: "100%",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            color: "#666",
                            textAlign: "start"
                        }}>
                        Live life without excuses, travel without regrets
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            width: "100%",
                            textTransform: "none",
                            borderRadius: "16px"
                        }}
                        onClick={() => { router.push(RouteConfig.Login.Path) }}
                    >
                        Sign in
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{
                            width: "100%",
                            textTransform: "none",
                            borderRadius: "16px"
                        }}
                        onClick={() => { router.push(RouteConfig.Register.Path) }}
                    >
                        Sign up
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Typography
                        color="textSecondary"
                        sx={{
                            fontStyle: "italic",
                            fontSize: 20,
                            mr: 1
                        }}
                    >
                        Or
                    </Typography>
                    <Link
                        href={RouteConfig.Community.Path}
                        sx={{
                            color: "#000",
                            fontStyle: "italic",
                            fontSize: 20,
                            textDecoration: "noneunderline #000",
                        }}
                    >
                        continue as a guest
                    </Link>
                </Box>
            </Box>
        </Card>
    );
};

export default Welcome;