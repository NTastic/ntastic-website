"use client";
import React, { useEffect, useRef, useState } from "react";
import { RouteConfig } from "@/routes/route";
import { GET_CATEGORIES, GET_POI_LIST } from "@/graphql/poi";
import { useQuery } from "@apollo/client";
import { CategoryValue, POIListItemValue } from "@/shared/constants/types";
import { Box, Icon, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from "next/navigation";
import StarIcon from '@mui/icons-material/Star';
import { truncateContent } from "@/utils/TruncateContent";
import { SpinningHourglass } from "@/utils/Animations";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface POIListProps {
    categoryId: string;
};

const POIList: React.FC<POIListProps> = ({ categoryId }) => {
    const router = useRouter();
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryValue[]>([]);
    const [POIList, setPOIList] = useState<POIListItemValue[]>([]);
    const [POIListPage, setPOIListPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    const { data: POIListData, refetch: refetchPOIList } = useQuery(
        GET_POI_LIST,
        {
            variables: {
                catIds: [categoryId],
                pageOptions: {
                    "limit": 10,
                    "page": POIListPage,
                    "sortField": "rating",
                    "order": "DESC"
                }
            },
            fetchPolicy: "no-cache",
        }
    );

    const handleMorePOI = () => {
        setIsLoading(true);
        setPOIListPage(prev => prev + 1);
        refetchPOIList().then(() => setIsLoading(false));
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
            const metadata = RouteConfig.Category(categoryId, categoryName).Metadata;
            document.title = metadata.title;
        }
    }, [categoryName]);

    useEffect(() => {
        if (POIListData) {
            setPOIList(prev => [...prev, ...POIListData.getPOIs.items]);
        }
    }, [POIListData]);

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
                justifyContent: "space-around",
            }}
        >
            <Box width="100%" position="relative" mt={2} mb={2}>
                <Typography width="100%" variant="h4" textAlign="center" fontWeight="bold">
                    {categoryName}
                </Typography>
                <IconButton
                    sx={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                    onClick={() => { router.back() }}
                >
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "16px"
                }}
            >
                <List
                    sx={{
                        width: "90%"
                    }}
                >
                    {POIList.map((item: POIListItemValue) => (
                        <ListItem key={item.id}>
                            <ListItemButton
                                onClick={() => {
                                    router.push(RouteConfig.POI(categoryId, categoryName!, item.id).Path)
                                }}
                                sx={{
                                    width: "95%",
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 2,
                                    alignItems: "center",
                                    borderRadius: "16px",
                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                                    transition: "all 0.5s ease",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
                                    }
                                }}
                            >
                                <Box
                                    width="200px"
                                    height="200px"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <img
                                        src={item.photoUrls[0]}
                                        alt={item.name}
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            objectFit: "cover",
                                            borderRadius: "16px"
                                        }}
                                        loading="lazy"
                                    />
                                </Box>
                                <Box
                                    flexGrow={1}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="start"
                                    gap={1}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        gap={1}
                                    >
                                        <Icon color="warning">
                                            <StarIcon />
                                        </Icon>
                                        <Typography variant="body1" color="textSecondary">
                                            {item.rating}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="textSecondary">
                                        {truncateContent(item.reviewSummary, 20)}
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <IconButton
                    color="primary"
                    onClick={handleMorePOI}
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
    );
};

export default POIList;