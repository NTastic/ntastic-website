import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            accessToken
            refreshToken
            user {
                id
            }
        }
    }
`;

export const REGISTER = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            accessToken
            refreshToken
            user {
                id
            }
        }
    }
`;

export const REFRESH_TOKEN_ = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout($refreshToken: String!) {
        logout(refreshToken: $refreshToken) {
            result
        }
    }
`;

export const GET_USER = gql`
    query GetUser($getUserId: ID!) {
        getUser(id: $getUserId) {
            id
            avatar
            username
            description
        }
    }
`;

export const GET_QUESTIONS_BY_USER_ID = gql`
    query GetQuestions($userId: ID) {
        getQuestions(userId: $userId) {
            items {
                ... on Question {
                    id
                    author {
                        id
                        avatar
                        username
                    }
                    title
                    content
                    answers {
                        totalItems
                    }
                    votes {
                        upvotes
                    }
                }
            }
        }
    }
`;

export const GET_ANSWERS_BY_USER_ID = gql`
    query GetAnswers($userId: ID) {
        getAnswers(userId: $userId) {
            items {
                ... on Answer {
                    id
                    question {
                        id
                        author {
                            id
                            avatar
                            username
                        }
                        title
                        content
                    }
                    content
                    votes {
                        upvotes
                    }
                }
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($input: UserInput) {
        updateUser(input: $input) {
            id
        }
    }
`;