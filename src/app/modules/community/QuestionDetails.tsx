"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_QUESTION, GET_ANSWERS, GET_QUESTIONS } from "@/graphql/qa";
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Typography
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ACCESS_TOKEN, SELECTED_TAGS } from "@/shared/constants/storage";
import { RouteConfig } from "@/routes/route";
import PostAnAnswer from "./PostAnAnswer";

type QuestionValue = {
    id: string;
    author: {
        id: string,
        username: string
    };
    title: string;
    content: string;
    tags: Array<{
        id: string;
        name: string;
    }>;
    images: Array<string>;
    votes: {
        upvotes: number,
        downvotes: number
    }
};

type AnswerValue = {
    id: string;
    author: {
        id: string,
        username: string
    };
    content: string;
    votes: {
        upvotes: number,
        downvotes: number
    };
    images: Array<string>;
};

type RelatedQuestionValue = {
    id: string;
    author: {
        id: string,
        username: string
    };
    title: string;
    content: string;
    tags: Array<{
        id: string,
        name: string,
    }>;
    answers: {
        items: Array<{
            id: string
        }>
    };
    votes: {
        upvotes: number,
        downvotes: number
    };
};

const QuestionDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const tagIds = typeof window !== "undefined" ? localStorage.getItem(SELECTED_TAGS)?.split(";") : [];
    const [isAuth, setIsAuth] = useState<boolean>(false);
    let currentPage = 1;
    const [question, setQuestion] = useState<QuestionValue | null>(null);
    const [answers, setAnswers] = useState<AnswerValue[]>([]);
    const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestionValue[]>([]);
    const [openAnswerDialog, setOpenAnswerDialog] = useState<boolean>(false);

    const { data: questionData } = useQuery(
        GET_QUESTION,
        { variables: { getQuestionId: params.id } }
    );

    const { data: answerData } = useQuery(
        GET_ANSWERS,
        {
            variables: {
                questionId: params.id,
                pageOptions: {
                    limit: 30,
                    sortField: "votes.upvotes",
                    order: "DESC",
                    page: currentPage
                }
            },
            skip: !question
        }
    );

    const { data: relatedData } = useQuery(
        GET_QUESTIONS,
        {
            variables: {
                tagIds: tagIds && tagIds[0] && tagIds[0].length > 0 ? tagIds : [],
                pageOptions: {
                    limit: 10,
                    sortField: "updatedAt",
                    order: "DESC"
                }
            },
            skip: !question
        }
    );

    useEffect(() => {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
        setAccessToken(accessToken);
    }, []);

    useEffect(() => {
        setIsAuth(!!accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (questionData) {
            setQuestion(questionData?.getQuestion);
        }
    }, [questionData]);

    useEffect(() => {
        if (answerData) {
            setAnswers(answerData?.getAnswers.items || []);
        }
    }, [answerData]);

    useEffect(() => {
        if (relatedData) {
            const filteredQuestions = relatedData?.getQuestions.items.filter(
                (item: RelatedQuestionValue) => item.id !== params.id
            ) || [];
            setRelatedQuestions(filteredQuestions);
        }
    }, [relatedData])

    const truncateContent = (content: string, wordLimit: number = 50) => {
        const words = content.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + " ...";
        }
        return content;
    }

    const handleOpenAnswerDialog = () => setOpenAnswerDialog(true);

    const handleCloseAnswerDialog = () => setOpenAnswerDialog(false);

    return (
        <Box
            sx={{
                width: "90%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                padding: 3,
                margin: { xs: 1, md: 0 }
            }}
        >
            <Box display="flex" sx={{ width: "100%", alignItems: "center", mb: 2 }}>
                <IconButton
                    size='large'
                    edge='start'
                    onClick={() => { router.push(RouteConfig.Community.Path) }}
                    sx={{ mr: 1 }}
                >
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                    Community
                </Typography>
                <Button
                    sx={{
                        fontSize: "large",
                        fontWeight: "bold",
                        color: "orange",
                        textTransform: "none",
                        borderRadius: "16px",
                        transition: "all 0.5s ease",
                        "&:hover": {
                            transform: "scale(1.1)",
                            backgroundColor: "rgba(30, 80, 255, 0.5)"
                        }
                    }}
                    onClick={() => { router.push(isAuth ? RouteConfig.PostAQuestion.Path : RouteConfig.Login.Path) }}
                >
                    Ask
                </Button>
            </Box>
            {question && (
                <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                        {question.title}
                    </Typography>
                    <Box display="flex">
                        <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                        <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                            {question.author.username}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        {question.content}
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                            {question.votes.upvotes} agree
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                            {answers.length} Answers
                        </Typography>
                    </Box>
                </Box>
            )}
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <List>
                {answers && answers.map((item: AnswerValue) => (
                    <ListItem
                        key={item.id}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            mb: 1,
                            gap: 1
                        }}
                    >
                        <Box display="flex">
                            <Avatar sx={{ width: "15px", height: "15px", mr: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: "small", color: "#333" }}>
                                {item.author.username}
                            </Typography>
                        </Box>
                        <Typography variant="body1">
                            {item.content}
                        </Typography>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                sx={{
                                    height: "30px",
                                    backgroundColor: "#ccc",
                                    borderRadius: "12px",
                                    textTransform: "none"
                                }}
                            >
                                Agree  {item.votes.upvotes}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    height: "30px",
                                    backgroundColor: "#ccc",
                                    borderRadius: "12px",
                                    textTransform: "none"
                                }}
                            >
                                Disagree  {item.votes.downvotes}
                            </Button>
                        </Box>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
                Related questions
            </Typography>
            <List
                sx={{
                    width: "100%"
                }}
            >
                {relatedQuestions.map((item: RelatedQuestionValue) => (
                    <ListItem
                        key={item.id}
                    >
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
                                    transform: "scale(1.05)",
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
                                {truncateContent(item.content)}
                            </Typography>
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
            <Button
                variant="contained"
                color="success"
                sx={{
                    width: "60%",
                    borderRadius: "16px",
                    position: "fixed",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
                onClick={handleOpenAnswerDialog}
            >
                I have an answer for this ...
            </Button>
            <PostAnAnswer
                open={openAnswerDialog}
                questionId={params.id}
                handleCloseAnswerDialog={handleCloseAnswerDialog}
            />
        </Box>
    );
};

export default QuestionDetails;