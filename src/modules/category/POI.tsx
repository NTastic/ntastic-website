"use client"
import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, IconButton, Stack, TextField, Typography, InputAdornment, Divider, List, ListItem, Link } from "@mui/material";
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
import { CategoryValue, POIValue } from "@/shared/constants/types";
import { GET_CATEGORIES, GET_ONE_POI } from "@/graphql/poi";
import { useQuery } from "@apollo/client";
import { SpinningHourglass } from "@/utils/Animations";
import { RouteConfig } from "@/routes/route";

interface POIProps {
    categoryId: string;
    poiId: string;
};

const comments = [
    {
        id: 0,
        author: {
            username: "Jack"
        },
        comment: "This is my favorite restaurant in Darwin cause Every time I go there on Turesday, I can have the voucher of main meal with the kid meal for free.",
        votes: {
            upvotes: 7
        }
    },
];

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
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryValue[]>([]);
    const [POIData, setPOIData] = useState<POIValue | null>(null);
    const [POIImages, setPOIImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    const { data } = useQuery(GET_ONE_POI, { variables: { getPoiId: poiId } });

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
        if (data) {
            setPOIData(data.getPOI || null);
            setPOIImages(data.getPOI.photoUrls.slice(0, 9) || []);
        }
    }, [data]);

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
                justifyContent="center"
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
                justifyContent="space-between"
                mt={2}
                mb={2}
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
                                    fontSize: index === currentIndex ? 20 : 10,

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
                <Typography variant="h5" gutterBottom>
                    {POIData.name}
                </Typography>
                <Typography variant="body1">
                    Stars: {POIData.rating || "unknown"}
                </Typography>
                <Typography variant="body1">
                    Location: {POIData.address || "unknown"}
                </Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                >
                    <Typography variant="body1">
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
                    flexDirection="row"
                    alignItems="center"
                    gap={1}
                >
                    <Typography variant="body1">
                        Website:
                    </Typography>
                    {POIData.website ? (
                        <Link
                            href={POIData.website}
                            variant="body1"
                            underline="hover"
                            target="_blank"
                            rel="noopener noreferrer"
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
                <List sx={{ width: "90%" }}>
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
                                mb: 2
                            }}
                        >
                            <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                                <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                                <Typography variant="body2" fontSize="small">
                                    {item.author.username}
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontSize="small">
                                {item.comment}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            )}
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
                </Box>
            </Box>
        </Box>
    );
};

export default POI;