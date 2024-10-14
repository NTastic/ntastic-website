"use client"
import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, IconButton, Stack, TextField, Typography, InputAdornment } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IosShareIcon from '@mui/icons-material/IosShare';
import CircleIcon from '@mui/icons-material/Circle';
import CreateIcon from '@mui/icons-material/Create';
import SendIcon from "@mui/icons-material/Send";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useRouter } from "next/navigation";
import { handleShare } from "@/utils/HandleShare";
import { RouteConfig } from "@/routes/route";

interface RecommendationProps {
    category: string;
    poi_id: string;
    recommendation_id: string;
};

const images = [
    "https://picsum.photos/500/300",
    "https://picsum.photos/550/300",
    "https://picsum.photos/600/300",
    "https://picsum.photos/450/300"
];

const Recommendation: React.FC<RecommendationProps> = ({ category, poi_id, recommendation_id }) => {
    const router = useRouter();
    const [followed, setFollowed] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleFollow = () => setFollowed(prev => !prev);

    const prevSlide = (): void => {
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    };

    const nextSlide = (): void => {
        setCurrentIndex(prev => (prev + 1) % images.length);
    };

    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isHovered]);

    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                padding: 1,
                margin: { xs: 1, md: 0 },
                alignItems: "center",
                justifyContent: "space-around"
            }}
        >
            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt={2}
                mb={2}
            // position="fixed"
            >
                <IconButton sx={{ color: "#000", mr: 2 }}>
                    <ChevronLeft />
                </IconButton>
                <Avatar sx={{ width: "30px", height: "30px", mr: 2 }} />
                <Typography variant="h6" fontWeight="bold" flexGrow={1}>
                    Jack
                </Typography>
                <Button
                    variant="contained"
                    color={followed ? "success" : "warning"}
                    onClick={handleFollow}
                    sx={{
                        borderRadius: "16px",
                        textTransform: "none",
                        mr: 1
                    }}
                >
                    {followed ? "Following" : "Follow"}
                </Button>
                <IconButton onClick={handleShare} color="primary">
                    <IosShareIcon />
                </IconButton>
            </Box>
            <Box
                width="100%"
                height="300px"
                position="relative"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={images[currentIndex]}
                    style={{ height: "80%", width: "auto" }}
                    loading="lazy"
                />
                <Button
                    onClick={prevSlide}
                    sx={{
                        position: "absolute",
                        left: 10,
                        top: "40%",
                        transform: "translateY(-40%)",
                        zIndex: 1,
                    }}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    onClick={nextSlide}
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: "40%",
                        transform: "translateY(-40%)",
                        zIndex: 1,
                    }}
                >
                    <ChevronRight />
                </Button>
                <Stack direction="row" spacing={2}>
                    {images.map((_, index) => (
                        <IconButton
                            key={index}
                            sx={{
                                transition: "all 0.5s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)"
                                }
                            }}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <CircleIcon
                                sx={{
                                    transition: "all 0.5s ease",
                                    color: index === currentIndex ? "coral" : "#ccc",
                                    fontSize: index === currentIndex ? 25 : 15,

                                }}
                            />
                        </IconButton>
                    ))}
                </Stack>
            </Box>
            <Box width="100%" mb={2}>
                <Typography variant="h6">
                    The best restaurant in Darwin
                </Typography>
                <Typography variant="body1">
                    This is my favorite restaurant in Darwin cause Every time I go there on Turesday, I can have the voucher of main meal with the kid meal for free.
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={() => {router.push(RouteConfig.POI("restaurant", "001").Path)}}
                sx={{
                    width: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    position: "relative",
                    textTransform: "none",
                    padding: 2
                }}
            >
                <Typography variant="h5">
                    Breezes Bar & Bistro
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    480 Lee Point Rd, Muirhead NT 0810
                </Typography>
                <Box
                    sx={{
                        position: "absolute",
                        right: 5,
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                >
                    <ChevronRight />
                </Box>
            </Button>
            <Box width="100%" position="relative">
                <Box
                    width="750px"
                    position="fixed"
                    display="flex"
                    flex="row"
                    alignItems="center"
                    bottom="10px"
                    borderRadius="16px"
                    padding={1}
                    sx={{
                        backgroundColor: "#00FF9C",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Say something ..."
                        multiline
                        sx={{
                            flexGrow: 1,
                            borderRadius: "16px",
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255)",
                            transition: "all 0.3s ease",
                            "&:focus-within": {
                                backgroundColor: "rgba(255, 255, 255)",
                            }
                        }}
                        InputProps={{
                            sx: {
                                borderRadius: "16px",
                            },
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <CreateIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end">
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <IconButton
                        sx={{
                            display: "flex",
                            flex: "row",
                            alignItems: "center",
                            gap: 0.5,
                            ml: 1,
                            mr: 1
                        }}
                    >
                        <FavoriteBorderIcon />
                        <Typography variant="body1">
                            45
                        </Typography>
                    </IconButton>
                    <IconButton
                        sx={{
                            display: "flex",
                            flex: "row",
                            alignItems: "center",
                            gap: 0.5,
                            ml: 1,
                            mr: 1
                        }}
                    >
                        <StarBorderOutlinedIcon />
                        <Typography variant="body1">
                            21
                        </Typography>
                    </IconButton>
                    <IconButton
                        sx={{
                            display: "flex",
                            flex: "row",
                            alignItems: "center",
                            gap: 0.5,
                            ml: 1,
                            mr: 1
                        }}
                    >
                        <ChatBubbleOutlineOutlinedIcon />
                        <Typography variant="body1">
                            22
                        </Typography>
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Recommendation;