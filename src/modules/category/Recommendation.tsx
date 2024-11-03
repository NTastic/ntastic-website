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
import { CategoryValue } from "@/shared/constants/types";
import { GET_CATEGORIES, GET_ONE_RECOMMENDATION } from "@/graphql/poi";
import { useQuery } from "@apollo/client";
import { RecommendationValue } from "@/shared/constants/types";
import { SpinningHourglass } from "@/utils/Animations";
import { isSmallScreen } from "@/utils/IsSmallScreen";

interface RecommendationProps {
    category_id: string;
    poi_id: string;
    recommendation_id: string;
};

const Recommendation: React.FC<RecommendationProps> = ({ category_id, poi_id, recommendation_id }) => {
    const router = useRouter();
    const isSmall = isSmallScreen();
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryValue[]>([]);
    const [recData, setRecData] = useState<RecommendationValue | null>(null);
    const [POIImages, setPOIImages] = useState<string[]>([]);
    const [followed, setFollowed] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    const { data: recommendationData } = useQuery(
        GET_ONE_RECOMMENDATION,
        { variables: { getRecommendationId: recommendation_id } }
    );

    const handleFollow = () => setFollowed(prev => !prev);

    const prevSlide = (): void => {
        if (POIImages.length > 1) {
            setCurrentIndex(prev => (prev - 1 + POIImages.length) % POIImages.length);
        }
    };

    const nextSlide = (): void => {
        if (POIImages.length > 1) {
            setCurrentIndex(prev => (prev + 1) % POIImages.length);
        }
    };

    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    useEffect(() => {
        if (categoriesData) {
            setCategories(categoriesData.getCategories || []);
        }
    }, [categoriesData]);

    useEffect(() => {
        if (categories.length > 0) {
            const currentCategory = categories.filter(item => item.id === category_id)[0];
            setCategoryName(currentCategory.name);
        }
    }, [categories])

    useEffect(() => {
        if (categoryName) {
            document.title = `NTastic | ${categoryName}`;
        }
    }, [categoryName]);

    useEffect(() => {
        if (recommendationData) {
            setRecData(recommendationData.getRecommendation || null);
            setPOIImages(recommendationData.getRecommendation.poi.photoUrls || []);
        }
    }, [recommendationData]);

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isHovered]);

    if (!recData) {
        return (
            <Box
                sx={{
                    width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <SpinningHourglass />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                padding: 1,
                alignItems: "center",
                justifyContent: "space-around"
            }}
        >
            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt={isSmall ? 1 : 2}
                mb={isSmall ? 1 : 2}
            // position="fixed"
            >
                <IconButton
                    onClick={() => router.back()}
                    sx={{ color: "#000", mr: isSmall ? 1 : 2 }}
                >
                    <ChevronLeft />
                </IconButton>
                <Button
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "start",
                        textTransform: "none",
                        color: "#333",
                        flexGrow: 1
                    }}
                >
                    <Avatar sx={{ width: "30px", height: "30px", mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                        Jack
                    </Typography>
                </Button>
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
                <Box
                    component="img"
                    sx={{
                        height: "80%", 
                        width: "auto"
                    }}
                    src={POIImages[currentIndex]}
                />
                <IconButton
                    onClick={prevSlide}
                    sx={{
                        position: "absolute",
                        left: isSmall ? 0 : 10,
                        top: "40%",
                        transform: "translateY(-40%)",
                        zIndex: 1,
                    }}
                >
                    <ChevronLeft />
                </IconButton>
                <IconButton
                    onClick={nextSlide}
                    sx={{
                        position: "absolute",
                        right: isSmall ? 0 : 10,
                        top: "40%",
                        transform: "translateY(-40%)",
                        zIndex: 1,
                    }}
                >
                    <ChevronRight />
                </IconButton>
                <Stack direction="row" spacing={1}>
                    {POIImages.map((_, index) => (
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
                                    fontSize: index === currentIndex ? (isSmall ? 20 : 25) : (isSmall ? 10 : 15),

                                }}
                            />
                        </IconButton>
                    ))}
                </Stack>
            </Box>
            <Box width="100%" mb={2}>
                {/* <Typography variant="h6">
                    The best restaurant in Darwin
                </Typography> */}
                <Typography variant="body1">
                    {recData.title}
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={() => { router.push(RouteConfig.POI(category_id, categoryName!, poi_id).Path) }}
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
                <Typography variant={isSmall ? "h6" : "h5"}>
                    {recData.poi.name}
                </Typography>
                <Typography variant={isSmall ? "body2" : "body1"} color="textSecondary">
                    {recData.poi.address}
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
            {/* Interaction with Recommendation */}
            {/* <Box
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
                    left: "calc(50% + 25px)",
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
            </Box> */}
        </Box>
    );
};

export default Recommendation;