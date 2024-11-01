"use client";
import React, { useEffect, useState } from "react";
import { GET_USER, GET_QUESTIONS_BY_USER_ID, GET_ANSWERS_BY_USER_ID } from "@/graphql/user";
import { UserValue, ProfileQuestionValue, ProfileAnswerValue } from "@/shared/constants/types";
import { useQuery } from "@apollo/client";
import { Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { SpinningHourglass } from "@/utils/Animations";
import { truncateContent } from "@/utils/TruncateContent";
import { RouteConfig } from "@/routes/route";

interface ProfileProps {
    user_id: string
};

const Profile: React.FC<ProfileProps> = ({ user_id }) => {
    const router = useRouter();
    const [user, setUser] = useState<UserValue | null>(null);
    const [questions, setQuestions] = useState<ProfileQuestionValue[]>([]);
    const [answers, setAnswers] = useState<ProfileAnswerValue[]>([]);
    const [selectedButton, setSelectedButton] = useState<string>("Questions");

    const { data: userData } = useQuery(
        GET_USER,
        { variables: { getUserId: user_id }, fetchPolicy: "no-cache" }
    );

    const { data: questionsData } = useQuery(
        GET_QUESTIONS_BY_USER_ID,
        { variables: { userId: user_id }, fetchPolicy: "no-cache" }
    );

    const { data: answersData } = useQuery(
        GET_ANSWERS_BY_USER_ID,
        { variables: { userId: user_id }, fetchPolicy: "no-cache" }
    );

    useEffect(() => {
        if (userData) {
            setUser(userData.getUser || null);
        }
    }, [userData]);

    useEffect(() => {
        if (questionsData) {
            setQuestions(questionsData.getQuestions.items || []);
        }
    }, [questionsData]);

    useEffect(() => {
        if (answersData) {
            setAnswers(answersData.getAnswers.items || []);
        }
    }, [answersData]);

    if (!user) {
        return (
            <Box
                sx={{
                    width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <SpinningHourglass />
            </Box>
        );
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
            {/* Return */}
            <Box width="100%">
                <IconButton onClick={() => { router.back(); }} edge="start">
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            {/* Avatar, Recommendation, Followers, Following */}
            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-around"
                mt={2}
                mb={2}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                        src={user.avatar || "none"}
                        sx={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            backgroundPosition: "center",
                            mb: 1
                        }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                        {user.username}
                    </Typography>
                </Box>
                <Button
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textTransform: "none",
                        color: "#333"
                    }}
                >
                    <Typography variant="body1">
                        23
                    </Typography>
                    <Typography variant="body2">
                        Recommendations
                    </Typography>
                </Button>
                <Button
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textTransform: "none",
                        color: "#333"
                    }}
                >
                    <Typography variant="body1">
                        100
                    </Typography>
                    <Typography variant="body2">
                        Followers
                    </Typography>
                </Button>
                <Button
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textTransform: "none",
                        color: "#333"
                    }}
                >
                    <Typography variant="body1">
                        34
                    </Typography>
                    <Typography variant="body2">
                        Following
                    </Typography>
                </Button>
            </Box>
            {/* User Discription */}
            <Box width="90%" mb={2}>
                <Typography variant="body1" color="textPrimary">
                    {user.description || "This user is mysterious ..."}
                </Typography>
            </Box>
            {/* Edit Profile Button */}
            <Box width="90%">
                <Button
                    sx={{
                        backgroundColor: "#bdbdbd",
                        borderRadius: "16px",
                        textTransform: "none",
                        color: "#000",
                        fontWeight: "bold",
                        padding: 1
                    }}
                    onClick={() => { router.push(RouteConfig.EditProfile.Path); }}
                >
                    Edit Profile
                </Button>
            </Box>
            {/* Questions & Answers Button */}
            <Box
                width="90%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-around"
            >
                <Button
                    onClick={() => setSelectedButton("Questions")}
                    sx={{
                        color: "#333",
                        textTransform: "none",
                        fontSize: "large",
                        borderBottom: selectedButton === "Questions" ? "3px solid #ff5722" : "none"
                    }}
                >
                    Questions
                </Button>
                <Button
                    onClick={() => setSelectedButton("Answers")}
                    sx={{
                        color: "#333",
                        textTransform: "none",
                        fontSize: "large",
                        borderBottom: selectedButton === "Answers" ? "3px solid #ff5722" : "none"
                    }}
                >
                    Answers
                </Button>
            </Box>
            <Divider
                sx={{
                    width: "100%",
                    marginTop: 0,
                    marginBottom: 2,
                    borderBottomWidth: "2px",
                    borderColor: "#999"
                }}
            />
            {/* Question List */}
            {
                questions.length > 0 && selectedButton === "Questions" && (
                    <List
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start"
                        }}
                    >
                        {questions.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        gap: 0.5,
                                        borderRadius: "16px",
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                                        transition: "all 0.5s ease",
                                        "&:hover": {
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                            backgroundColor: "#ccff90",
                                            transform: "translateY(-5px)"
                                        }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.title}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                    >
                                        <Avatar
                                            src={item.author.avatar || "none"}
                                            sx={{
                                                width: "15px",
                                                height: "15px",
                                                objectFit: "cover",
                                                backgroundPosition: "center",
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            {item.author.username}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="textPrimary">
                                        {item.content}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <Typography variant="body2" color="textSecondary">
                                            {item.votes.upvotes} Agree
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.answers.totalItems} Answers
                                        </Typography>
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )
            }
            {/* Answer List */}
            {
                answers.length > 0 && selectedButton === "Answers" && (
                    <List
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start"
                        }}
                    >
                        {answers.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        gap: 0.5,
                                        borderRadius: "16px",
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                                        transition: "all 0.5s ease",
                                        "&:hover": {
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                            backgroundColor: "#ccff90",
                                            transform: "translateY(-5px)"
                                        }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.question.title}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                    >
                                        <Avatar
                                            src={item.question.author.avatar || "none"}
                                            sx={{
                                                width: "15px",
                                                height: "15px",
                                                objectFit: "cover",
                                                backgroundPosition: "center",
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            {item.question.author.username}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="textPrimary">
                                        {truncateContent(item.content, 30)}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <Typography variant="body2" color="textSecondary">
                                            {item.votes.upvotes} Agree
                                        </Typography>
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )
            }
        </Box >
    );
};

export default Profile;