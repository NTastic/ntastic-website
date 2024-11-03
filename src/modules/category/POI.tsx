"use client"
import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, IconButton, Stack, TextField, Typography, InputAdornment, Divider, List, ListItem, Link, Icon } from "@mui/material";
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
import { CategoryValue, CommentValue, POIValue } from "@/shared/constants/types";
import { GET_CATEGORIES, GET_ONE_POI, GET_COMMENTS } from "@/graphql/poi";
import { useQuery } from "@apollo/client";
import { SpinningHourglass } from "@/utils/Animations";
import { RouteConfig } from "@/routes/route";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isSmallScreen } from "@/utils/IsSmallScreen";

interface POIProps {
    categoryId: string;
    poiId: string;
};

const bottomIconStyle = {
    display: "flex",
    flex: "row",
    alignItems: "center",
    gap: 0.5,
    ml: 1,
    mr: 1
};

const POI: React.FC<POIProps> = ({ categoryId, poiId }) => {
    const router = useRouter();
    const isSmall = isSmallScreen();
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryValue[]>([]);
    const [POIData, setPOIData] = useState<POIValue | null>(null);
    const [POIImages, setPOIImages] = useState<string[]>([]);
    const [comments, setComments] = useState<CommentValue[]>([]);
    const [commentPage, setCommentPage] = useState<number>(1);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);
    const { data: currentPOIData } = useQuery(
        GET_ONE_POI,
        { variables: { getPoiId: poiId } }
    );
    const { data: commentsData, refetch: refetchComments } = useQuery(
        GET_COMMENTS,
        {
            variables: {
                poiId: poiId,
                pageOptions: {
                    limit: 10,
                    page: commentPage,
                    sortOpts: [
                        {
                            field: "votes.upvotes",
                            order: "DESC"
                        }
                    ]
                }
            }
        }
    );

    const prevSlide = (): void => {
        if (POIImages.length > 0) {
            setCurrentIndex(prev => (prev - 1 + POIImages.length) % POIImages.length);
        }
    };

    const nextSlide = (): void => {
        if (POIImages.length > 0) {
            setCurrentIndex(prev => (prev + 1) % POIImages.length);
        }
    };

    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    const handleMoreComments = () => {
        setIsLoading(true);
        setCommentPage(prev => prev + 1);
        refetchComments().then(() => setIsLoading(false));
    };

    useEffect(() => {
        if (categoriesData) {
            setCategories(categoriesData.getCategories || []);
        }
    }, [categoriesData]);

    useEffect(() => {
        if (categories.length > 0) {
            const currentCategory = categories.filter(item => item.id === categoryId)[0];
            setCategoryName(currentCategory.name);
        }
    }, [categories])

    useEffect(() => {
        if (categoryName) {
            const metadata = RouteConfig.POI(categoryId, categoryName, poiId).Metadata;
            document.title = metadata.title;
        }
    }, [categoryName]);

    useEffect(() => {
        if (currentPOIData) {
            setPOIData(currentPOIData.getPOI || null);
            setPOIImages(currentPOIData.getPOI.photoUrls.slice(0, 9) || []);
        }
    }, [currentPOIData]);

    useEffect(() => {
        if (commentsData) {
            setComments(prev => [...prev, ...commentsData.getComments.items]);
        }
    }, [commentsData]);

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isHovered]);

    if (!POIData) {
        return (
            <Box
                width="100%"
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <SpinningHourglass />
            </Box>);
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
                justifyContent: "space-around",
                // marginBottom: isSmall ? "50px" : "80px"
            }}
        >
            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                mt={isSmall ? 1 : 2}
                mb={isSmall ? 1 : 2}
            >
                <IconButton
                    onClick={() => router.back()}
                    sx={{ color: "#000", mr: 2 }}
                >
                    <ChevronLeft />
                </IconButton>
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
                    src={POIImages[currentIndex]}
                    style={{ height: "80%", width: "auto" }}
                    loading="lazy"
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
                                    fontSize: index === currentIndex ? (isSmall ? 15 : 20) : (isSmall ? 10 : 15),

                                }}
                            />
                        </IconButton>
                    ))}
                </Stack>
            </Box>
            <Box
                width="90%"
                display="flex"
                flexDirection="column"
                alignItems="start"
                gap={1}
                mt={2}
                mb={2}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {POIData.name}
                </Typography>
                <Box display="flex" flexDirection="row" alignItems="start">
                    <Typography variant="body1" fontWeight="bold" mr={1}>
                        Rating:
                    </Typography>
                    <Typography variant="body1">
                        {POIData.rating || "unknown"}
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="start">
                    <Typography variant="body1" fontWeight="bold" mr={1}>
                        Location:
                    </Typography>
                    <Typography variant="body1">
                        {POIData.address || "unknown"}
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                >
                    <Typography variant="body1" fontWeight="bold">
                        Opened time:
                    </Typography>
                    {POIData.workingHours.length > 0 ? (
                        <List>
                            {POIData.workingHours.map((item, index) => (
                                <ListItem key={index}>
                                    <Typography variant="body2" color="#333">
                                        {item.day}: {item.time}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="#333">
                            unknown
                        </Typography>
                    )}
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    gap={1}
                >
                    <Typography variant="body1" fontWeight="bold">
                        Website:
                    </Typography>
                    {POIData.website ? (
                        <Link
                            href={POIData.website}
                            variant="body1"
                            underline="hover"
                            target="_blank"
                            rel="noopener noreferrer"
                            flexWrap="wrap"
                        >
                            {POIData.website}
                        </Link>
                    ) : (
                        <Typography variant="body2" color="#333">
                            unknown
                        </Typography>
                    )}
                </Box>
            </Box>
            <Divider sx={{ width: "100%", marginTop: 2, marginBottom: 2 }} />
            {comments.length > 0 && (
                <List sx={{ width: "95%" }}>
                    {comments.map((item) => (
                        <ListItem
                            key={item.id}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                borderRadius: "16px",
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                                mb: 1
                            }}
                        >
                            <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                                <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                                <Typography variant="body2" fontSize="small">
                                    {item.author.username}
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontSize="small">
                                {item.content}
                            </Typography>
                            <Box display="flex" flexDirection="row" alignItems="center" mr={1}>
                                <IconButton>
                                    <ThumbUpIcon />
                                </IconButton>
                                <Typography variant="body2">
                                    {item.votes.upvotes}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}
            <IconButton
                color="primary"
                onClick={handleMoreComments}
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <ExpandMoreIcon />
                <Typography>More</Typography>
            </IconButton>
            {isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        position: "relative",
                        bottom: 0
                    }}
                >
                    <SpinningHourglass />
                </Box>
            )}
            {/* Interaction with the POI */}
            {/* <Box
                width="750px"
                position="fixed"
                display="flex"
                flex="row"
                alignItems="center"
                bottom="16px"
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
                    placeholder={`Comment this ${categoryName}...`}
                    multiline
                    sx={{
                        flexGrow: 1,
                        borderRadius: "16px",
                        border: "none",
                        backgroundColor: "rgba(255, 255, 255)",
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
                    sx={bottomIconStyle}
                >
                    <FavoriteBorderIcon />
                    <Typography variant="body1">
                        {POIData.votes.upvotes || 0}
                    </Typography>
                </IconButton>
                <IconButton
                    sx={bottomIconStyle}
                >
                    <StarBorderOutlinedIcon />
                    <Typography variant="body1">
                        21
                    </Typography>
                </IconButton>
                <IconButton
                    sx={bottomIconStyle}
                >
                    <ChatBubbleOutlineOutlinedIcon />
                    <Typography variant="body1">
                        {POIData.reviewsCount || 0}
                    </Typography>
                </IconButton>
            </Box> */}
        </Box>
    );
};

export default POI;