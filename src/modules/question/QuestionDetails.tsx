"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_QUESTION, GET_ANSWERS, GET_QUESTIONS, VOTE } from "@/graphql/qa";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import IosShareIcon from '@mui/icons-material/IosShare';
import { ACCESS_TOKEN, SELECTED_TAG } from "@/shared/constants/storage";
import { RouteConfig } from "@/routes/route";
import { QuestionValue, AnswerValue, RelatedQuestionValue } from "@/shared/constants/types";
import AnswerList from "@/modules/question/AnswerList";
import QuestionDesc from "@/modules/question/QuestionDesc";
import RelatedQuestions from "@/modules/question/RelatedQuestions";
import PostAnAnswer from "@/modules/question/PostAnAnswer";
import { handleShare } from "@/utils/HandleShare";

const QuestionDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
    const router = useRouter();

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const tagIds = typeof window !== "undefined" ? [localStorage.getItem(SELECTED_TAG)] : [];
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [question, setQuestion] = useState<QuestionValue | null>(null);
    const [answers, setAnswers] = useState<AnswerValue[]>([]);
    const [answerLimit, setAnswerLimit] = useState<number>(30);
    const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestionValue[]>([]);
    const [relatedQuestionsLimit, setRelatedQuestionsLimit] = useState<number>(10);
    const [openAnswerDialog, setOpenAnswerDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                    limit: answerLimit,
                    sortField: "votes.upvotes",
                    order: "DESC",
                    page: 1
                }
            },
            skip: !question
        }
    );
    const { data: relatedData, refetch: refetchRelatedData } = useQuery(
        GET_QUESTIONS,
        {
            variables: {
                tagIds: tagIds && tagIds[0] && tagIds[0].length > 0 ? tagIds : [],
                pageOptions: {
                    limit: relatedQuestionsLimit,
                    sortField: "updatedAt",
                    order: "DESC"
                }
            },
            skip: !question
        }
    );

    const getMoreAnswers = () => {
        setAnswerLimit(prev => prev + 30);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        refetchAnswer();
    };

    const getMoreRelatedQuestions = () => {
        setRelatedQuestionsLimit(prev => prev + 10);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        refetchRelatedData();
    };

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

    const truncateContent = (content: string, wordLimit: number = 50) => {
        const words = content.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + " ...";
        }
        return content;
    }

    const handleOpenAnswerDialog = () => setOpenAnswerDialog(true);

    const handleCloseAnswerDialog = () => setOpenAnswerDialog(false);

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
            setAnswers(answerData.getAnswers.items);
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
                <IconButton onClick={handleShare} color="primary">
                    <IosShareIcon/>
                </IconButton>
            </Box>
            {/* Question Description */}
            {question && (
                <QuestionDesc
                    question={question}
                    answers={answers}
                    handleVoteQuestion={handleVoteQuestion}
                />
            )}
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            {/* Answers */}
            {answers.length > 0 && (
                <AnswerList
                    answers={answers}
                    handleVoteAnswer={handleVoteAnswer}
                    getMoreAnswers={getMoreAnswers}
                    isLoading={isLoading}
                />
            )}
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            {/* Related questions */}
            {relatedQuestions.length > 0 && (
                <RelatedQuestions
                    relatedQuestions={relatedQuestions}
                    truncateContent={truncateContent}
                    getMoreRelatedQuestions={getMoreRelatedQuestions}
                    isLoading={isLoading}
                />
            )}
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