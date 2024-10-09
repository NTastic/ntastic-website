"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_QUESTION, GET_ANSWERS, GET_QUESTIONS, VOTE } from "@/graphql/qa";
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
import { ACCESS_TOKEN, SELECTED_TAG } from "@/shared/constants/storage";
import { RouteConfig } from "@/routes/route";
import PostAnAnswer from "./PostAnAnswer";
import ReactMarkdown from "react-markdown";
import DisplayImages from "@/modules/community/DisplayImages";
import { QuestionValue, AnswerValue, RelatedQuestionValue } from "@/modules/community//types";

const QuestionDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const tagIds = typeof window !== "undefined" ? [localStorage.getItem(SELECTED_TAG)] : [];
    const [isAuth, setIsAuth] = useState<boolean>(false);
    let currentPage = 1;
    const [question, setQuestion] = useState<QuestionValue | null>(null);
    const [answers, setAnswers] = useState<AnswerValue[]>([]);
    const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestionValue[]>([]);
    const [openAnswerDialog, setOpenAnswerDialog] = useState<boolean>(false);
    const [vote] = useMutation(VOTE);

    const { data: questionData, refetch: refetchQuestion } = useQuery(
        GET_QUESTION,
        { variables: { getQuestionId: params.id } }
    );

    const { data: answerData, refetch: refetchAnswer } = useQuery(
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

    const handleVoteQuestion = async () => {
        try {
            let resp = await vote({
                variables: {
                    targetId: params.id,
                    targetType: "Question",
                    voteType: "upvote"
                }
            });

            if (resp.data && !resp.data.vote.success) {
                resp = await vote({
                    variables: {
                        targetId: params.id,
                        targetType: "Question",
                        voteType: "cancel"
                    }
                });
            }
        } catch (err) {
            console.log(`Vote Error: ${(err as Error).message}`);
        } finally {
            refetchQuestion();
        }
    };

    const handleVoteAnswer = async (answerId: string, voteType: string) => {
        try {
            let resp = await vote({
                variables: {
                    targetId: answerId,
                    targetType: "Answer",
                    voteType: voteType
                }
            });

            if (resp.data && !resp.data.vote.success) {
                resp = await vote({
                    variables: {
                        targetId: answerId,
                        targetType: "Answer",
                        voteType: "cancel"
                    }
                });
            }
        } catch (err) {
            console.log(`Vote Error: ${(err as Error).message}`);
        } finally {
            refetchAnswer();
        }
    };

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
            const updatedAnswers = answerData.getAnswers.items.map((answer: AnswerValue) => ({
                ...answer,
                localVotes: {
                    upvotes: answer.votes.upvotes,
                    downvotes: answer.votes.downvotes,
                }
            }))
            setAnswers(updatedAnswers || []);
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
                    {question.images.length > 0 && (
                        <Box mb={2}>
                            <DisplayImages images={question.images} height={300} />
                        </Box>
                    )}
                    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                        <Button
                            variant="contained"
                            color="info"
                            sx={{
                                textTransform: "none",
                                borderRadius: "12px"
                            }}
                            onClick={() => handleVoteQuestion()}
                        >
                            Helpful {question.votes.upvotes}
                        </Button>
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
                        <Box>
                            <ReactMarkdown>
                                {item.content}
                            </ReactMarkdown>
                        </Box>
                        {item.images.length > 0 && (
                            <Box mb={2}>
                                <DisplayImages images={item.images} height={300} />
                            </Box>
                        )}
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{
                                    height: "30px",
                                    borderRadius: "12px",
                                    textTransform: "none"
                                }}
                                onClick={() => handleVoteAnswer(item.id, "upvote")}
                            >
                                Agree  {item.votes.upvotes}
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                sx={{
                                    height: "30px",
                                    borderRadius: "12px",
                                    textTransform: "none"
                                }}
                                onClick={() => handleVoteAnswer(item.id, "downvote")}
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
                            <ReactMarkdown>
                                {truncateContent(item.content)}
                            </ReactMarkdown>
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
                color="secondary"
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
                refetchAnswer={refetchAnswer}
            />
        </Box>
    );
};

export default QuestionDetails;