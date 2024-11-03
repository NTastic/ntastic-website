"use client";
import React, { useEffect, useState } from "react";
import { RouteConfig } from "@/routes/route";
import { GET_CATEGORIES, GET_SUB_CATEGORIES, GET_POI_LIST } from "@/graphql/poi";
import { useQuery } from "@apollo/client";
import { CategoryValue, POIListItemValue } from "@/shared/constants/types";
import { Box, Button, Collapse, Icon, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from "next/navigation";
import StarIcon from '@mui/icons-material/Star';
import { truncateContent } from "@/utils/TruncateContent";
import { SpinningHourglass } from "@/utils/Animations";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isSmallScreen } from "@/utils/IsSmallScreen";

interface POIListProps {
    categoryId: string;
};

const buttonStyle = (isSmall: boolean) => ({
    borderRadius: "16px",
    margin: 1,
    textTransform: "none",
    backgroundColor: "#d0d0d0",
    color: "#000",
    fontSize: isSmall ? "x-small" : "small",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "#3388cc",
        color: "#fff",
        transform: "scale(1.03) translateY(-3px)"
    }
});

const selectedButtonStyle = (isSmall: boolean) => ({
    borderRadius: "16px",
    margin: 1,
    textTransform: "none",
    backgroundColor: "#3388cc",
    color: "#fff",
    fontSize: isSmall ? "x-small" : "small",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "scale(1.03) translateY(-3px)"
    }
});

const POIList: React.FC<POIListProps> = ({ categoryId }) => {
    const router = useRouter();
    const isSmall = isSmallScreen();
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryValue[]>([]);
    const [openCollapse, setOpenCollapse] = useState<boolean>(false);
    const [subCats, setSubCats] = useState<CategoryValue[]>([]);
    const [selectedSubCatId, setSelectedSubCatId] = useState<string | null>(null);
    const [selectedSubCatName, setSelectedSubCatName] = useState<string | null>(null);
    const [isSubCatChanged, setIsSubCatChanged] = useState<boolean>(false);
    const [POIList, setPOIList] = useState<POIListItemValue[]>([]);
    const [POIListPage, setPOIListPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    const { data: subCatsData } = useQuery(
        GET_SUB_CATEGORIES,
        {
            variables: { parentCatId: categoryId },
            fetchPolicy: "no-cache"
        }
    );

    const { data: POIListData, refetch: refetchPOIList } = useQuery(
        GET_POI_LIST,
        {
            variables: {
                catIds: [selectedSubCatId || categoryId],
                pageOptions: {
                    limit: 10,
                    page: POIListPage,
                    sortOpts: [
                        {
                            field: "rating",
                            order: "DESC"
                        }
                    ]
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

    const handleCollapse = () => setOpenCollapse(prev => !prev);

    const handleSelectSubCat = (item: CategoryValue | null) => {
        setIsSubCatChanged(true);
        setTimeout(() => { }, 100);
        if (!item || selectedSubCatId === item.id) {
            setSelectedSubCatId(null);
            setSelectedSubCatName(null);
        } else {
            setSelectedSubCatId(item.id);
            setSelectedSubCatName(item.name);
        }
        setOpenCollapse(false);
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
        if (subCatsData) {
            setSubCats(subCatsData.getCategories);
        }
    }, [subCatsData]);

    useEffect(() => {
        if (isSubCatChanged) {
            setPOIList([]);
            setPOIListPage(1);
            setIsSubCatChanged(false);
        }
    }, [isSubCatChanged]);

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
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box
                width="100%"
                position="relative"
                padding={0}
                mt={2}
                mb={2}
            >
                <Typography
                    width="100%"
                    variant={isSmall ? "h5" : "h4"}
                    textAlign="center"
                    fontWeight="bold"
                >
                    {categoryName}
                </Typography>
                <IconButton
                    sx={{
                        position: "absolute",
                        left: isSmall ? 0 : "10px",
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                    onClick={() => { router.back() }}
                >
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            {subCats.length > 0 && (
                <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Box
                        width="95%"
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                    >
                        <Typography
                            variant={isSmall ? "body2" : "body1"}
                            fontWeight="bold"
                            flexGrow={1}
                        >
                            Current Display: {selectedSubCatName || "All"}
                        </Typography>
                        <Button
                            onClick={handleCollapse}
                            sx={{
                                textTransform: "none",
                                fontSize: isSmall ? "small" : "medium"
                            }}
                        >
                            {openCollapse ? "Show Less" : "Show More"}
                        </Button>
                    </Box>
                    <Collapse
                        in={openCollapse}
                        collapsedSize={50}
                        timeout={500}
                    >
                        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                            <Box width="90%" display="flex" flexWrap="wrap" gap={isSmall ? 0 : 1}>
                                <Button
                                    variant="contained"
                                    sx={!selectedSubCatId ? selectedButtonStyle(isSmall) : buttonStyle(isSmall)}
                                    onClick={() => handleSelectSubCat(null)}
                                >
                                    All
                                </Button>
                                {subCats.map((item: CategoryValue) => (
                                    <Button
                                        key={item.id}
                                        variant="contained"
                                        sx={selectedSubCatId === item.id ? selectedButtonStyle(isSmall) : buttonStyle(isSmall)}
                                        onClick={() => handleSelectSubCat(item)}
                                    >
                                        {item.name}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            )}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "16px"
                }}
            >
                <List>
                    {POIList.map((item: POIListItemValue) => (
                        <ListItem key={item.id} sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    router.push(RouteConfig.POI(categoryId, categoryName!, item.id).Path)
                                }}
                                sx={{
                                    width: "95%",
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 1,
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
                                    component="img"
                                    sx={{
                                        height: isSmall ? "100px" : "180px",
                                        width: isSmall ? "100px" : "180px",
                                        borderRadius: "16px"
                                    }}
                                    alt={item.name}
                                    src={item.photoUrls[0]}
                                />
                                <Box
                                    // flexGrow={1}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    gap={1}
                                >
                                    <Typography
                                        variant={isSmall ? "body1" : "h6"}
                                        fontWeight="bold"
                                    >
                                        {item.name}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <StarIcon color="warning" />
                                        <Typography
                                            variant={isSmall ? "body2" : "body1"}
                                            color="textSecondary"
                                        >
                                            {item.rating}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="textSecondary">
                                        {truncateContent(item.reviewSummary, isSmall ? 10 : 20)}
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