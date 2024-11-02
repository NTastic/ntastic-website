"use client";
import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import { truncateContent } from '@/utils/TruncateContent';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import { SpinningHourglass } from '@/utils/Animations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GET_RECOMMENDATIONS } from '@/graphql/poi';
import { useQuery } from '@apollo/client';
import { CategoryValue, RecommendationValue } from '@/shared/constants/types';
import StarIcon from '@mui/icons-material/Star';

interface RecommendationsProps {
    categories: Array<CategoryValue>
};

const Recommendations: React.FC<RecommendationsProps> = ({categories}) => {
    const router = useRouter();
    const catIds: string[] = categories.map(cat => cat.id);
    const [recList, setRecList] = useState<RecommendationValue[]>([]);
    const [recPage, setRecPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [defaultLocation, setDefaultLocation] = useState<{
        latitude: number; longtitude: number
    }>({
        latitude: -12.4637, longtitude: 130.8444
    });
    const [location, setLocation] = useState<{
        latitude: number; longtitude: number
    } | null>(null);

    const { data: recData, refetch } = useQuery(
        GET_RECOMMENDATIONS,
        {
            variables: {
                catIds: catIds,
                pageOptions: {
                    limit: 12,
                    page: recPage,
                    // sortOpts: [
                    //     { field: "comment.rating", order: "DESC" },
                    //     { field: "poi.rating", order: "DESC" },
                    //     { field: "poi.reviewsCount", order: "DESC"},
                    // ]
                },
                location: {
                    near: {
                        latitude: location ? location.latitude : defaultLocation.latitude,
                        longitude: location ? location.longtitude : defaultLocation.longtitude
                    },
                    // maxDistance: location ? 3000 : 100000
                }
            },
            fetchPolicy: "network-only"
        }
    );

    const getCurrentLocation = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    };

    const handleMoreRecs = () => {
        setIsLoading(true);
        setRecPage(prev => prev + 1);
        refetch().then(() => setIsLoading(false));
    };

    useEffect(() => {
        if (recData) {
            const filteredItems = recData.getRecommendations.items.filter(
                (item: RecommendationValue) => !recList.some(
                    exist => exist.id === item.id
                )
            );
            setRecList((prev) => {
                return [...prev, ...filteredItems];
            });
        }
    }, [recData]);

    useEffect(() => {
        getCurrentLocation().then((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longtitude: position.coords.longitude
            });
        }).catch((error) => console.error("Error getting location:", error.message));
    }, []);

    useEffect(() => {
        if (location && location !== defaultLocation) {
            setRecList([]);
            setDefaultLocation(location);
        }
    }, [location]);

    return (
        <Box
            sx={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Box
                width="100%"
                display="flex"
                flexDirection="column"
            >
                <Typography variant="h6" fontWeight="bold">
                    Recommendations
                </Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        width: "100%",
                        borderRadius: "16px"
                    }}

                >
                    <ImageList variant="masonry" cols={3} gap={8} sx={{ width: "95%" }}>
                        {recList.map((item) => (
                            <ImageListItem key={item.id}>
                                <Button
                                    sx={{
                                        borderRadius: "16px",
                                        textTransform: "none",
                                        color: "black",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: 1,
                                        transition: "all 0.5s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
                                        }
                                    }}
                                    onClick={() => {
                                        router.push(
                                            RouteConfig.Recommendation(
                                                item.catIds[0],
                                                item.poi.id,
                                                item.id
                                            ).Path
                                        )
                                    }}
                                >
                                    <img
                                        src={item.poi.photoUrls[0]}
                                        loading="lazy"
                                        style={{ width: "100%", height: "auto", borderRadius: "16px" }}
                                    />
                                    <Typography width="95%" variant="body2" textAlign="start">
                                        {truncateContent(item.title, 20)}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        width="100%"
                                    >
                                        <StarIcon
                                            sx={{
                                                mr: 0.5,
                                                color: "rgba(255, 0, 0, 0.5)"
                                            }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            {item.poi.rating}
                                        </Typography>
                                    </Box>
                                </Button>
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <IconButton
                        color="primary"
                        onClick={handleMoreRecs}
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
                </Box>
            </Box>
        </Box>
    );
};

export default Recommendations;