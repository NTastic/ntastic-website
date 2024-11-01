"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Box, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_QUESTIONS } from "@/graphql/qa";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";
import DisplayImages from "@/utils/DisplayImages";
import { QuestionsValue } from "@/shared/constants/types";
import { SpinningHourglass } from "@/utils/Animations";
import { truncateContent } from "@/utils/TruncateContent";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface NewQuestionsProps {
    selectedTag: string;
    isTagChanged: boolean;
    handleIsTagChanged: () => void;
};

const NewQuestions: React.FC<NewQuestionsProps> = ({
    selectedTag, isTagChanged, handleIsTagChanged
}) => {
    const router = useRouter();
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [questions, setQuestions] = useState<QuestionsValue[]>([]);
    const [queryPage, setQueryPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: questionData, refetch } = useQuery(
        GET_QUESTIONS,
        {
            variables: {
                tagIds: tagIds,
                pageOptions: {
                    limit: 10,
                    page: queryPage,
                    sortOpts: {
                        field: "updatedAt",
                        order: "DESC"
                    }
                }
            },
            fetchPolicy: "no-cache",
        }
    );

    const handleMoreQuestions = () => {
        setIsLoading(true);
        setQueryPage(prev => prev + 1);
        refetch().then(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isTagChanged) {
            setQuestions([]);
            setQueryPage(1);
            handleIsTagChanged();
        }
    }, [isTagChanged]);

    useEffect(() => {
        if (questionData) {
            setQuestions(prev => [...prev, ...questionData.getQuestions.items]);
        }
    }, [questionData]);

    useEffect(() => {
        if (selectedTag === "") {
            setTagIds([]);
        } else {
            setTagIds([selectedTag]);
        }
    }, [selectedTag]);

    return (
        <Box
            sx={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                padding: 3
            }}
        >
            <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold", mb: 1 }}>
                The newest asked questions:
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    borderRadius: "16px"
                }}
            >
                <List sx={{ width: "95%", paddingLeft: 1, paddingRight: 1 }}>
                    {questions.map((item: QuestionsValue) => (
                        <ListItem key={item.id}>
                            <ListItemButton
                                onClick={() => {
                                    router.push(`${RouteConfig.Community.Path}/${item.id}`);
                                }}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    mb: 2,
                                    borderRadius: "16px",
                                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
                                    transition: "all 0.5s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(80, 80, 200, 0.5)",
                                        transform: "scale(1.03)",
                                        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
                                    }
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {item.title}
                                </Typography>
                                <Box display="flex">
                                    <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                                    <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                        {item.author.username}
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {truncateContent(item.content, 50)}
                                </Typography>
                                {item.images.length > 0 && (
                                    <Box mb={1} mt={1}>
                                        <DisplayImages images={item.images} height={150} />
                                    </Box>
                                )}
                                <Box display="flex" gap={2}>
                                    <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                        {item.votes.upvotes} Agree
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                        {item.answers.items.length} Answers
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <IconButton
                    color="primary"
                    onClick={handleMoreQuestions}
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

export default NewQuestions;