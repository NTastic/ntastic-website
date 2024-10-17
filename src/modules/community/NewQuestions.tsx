"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_QUESTIONS } from "@/graphql/qa";
import { useRouter } from "next/navigation";
import { RouteConfig } from "@/routes/route";
import DisplayImages from "@/utils/DisplayImages";
import { QuestionsValue } from "@/shared/constants/types";
import { SpinningHourglass } from "@/utils/Animations";
import { truncateContent } from "@/utils/TruncateContent";

interface NewQuestionsProps {
    selectedTag: string;
};

const NewQuestions: React.FC<NewQuestionsProps> = ({ selectedTag }) => {
    const router = useRouter();
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [questions, setQuestions] = useState<QuestionsValue[]>([]);
    const [queryLimit, setQueryLimit] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const listInnerRef = useRef<HTMLDivElement | null>(null);

    const { data: questionData, refetch } = useQuery(
        GET_QUESTIONS,
        {
            variables: {
                tagIds: tagIds,
                pageOptions: {
                    limit: queryLimit,
                    sortField: "updatedAt",
                    order: "DESC"
                }
            },
            fetchPolicy: "no-cache",
        }
    );

    const handleScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                setQueryLimit((prevLimit) => prevLimit + 10);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
                refetch();
            }
        }
    };

    useEffect(() => {
        if (questionData) {
            setQuestions(questionData?.getQuestions.items || []);
        }
    }, [questionData]);

    useEffect(() => {
        if (selectedTag === "") {
            setTagIds([]);
        } else {
            setTagIds([selectedTag]);
        }
    }, [selectedTag]);

    useEffect(() => {
        const boxElement = listInnerRef.current;
        if (boxElement) {
            boxElement.addEventListener("scroll", handleScroll);
            return () => {
                boxElement.removeEventListener("scroll", handleScroll);
            };
        }
    }, [listInnerRef]);

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
                ref={listInnerRef}
                sx={{
                    width: "100%",
                    height: "800px",
                    overflowY: "auto",
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
            </Box>
            {isLoading && (
                <SpinningHourglass
                    sx={{
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                />
            )}
        </Box>
    );
};

export default NewQuestions;