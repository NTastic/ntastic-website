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