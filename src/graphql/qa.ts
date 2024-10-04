import { gql } from "@apollo/client";

export const GET_TAGS = gql`
    query GetTags($sort: TagSortInput) {
        getTags(sort: $sort) {
            id
            name
            questionCount
        }
    }
`;

export const GET_QUESTIONS = gql`
    query GetQuestions($tagIds: [ID!], $pageOptions: PageOptions) {
        getQuestions(tagIds: $tagIds, pageOptions: $pageOptions) {
            items {
                ... on Question {
                    id
                    author {
                        id
                        username
                    }
                    title
                    content
                    tags {
                        id
                        name
                    }
                    images
                    answers {
                        items {
                            ... on Answer {
                                id
                            }
                        }
                    }
                    votes {
                        upvotes
                        downvotes
                    }
                }
            }
        }
    }
`;

export const GET_QUESTION = gql`
query GetQuestion($getQuestionId: ID!) {
    getQuestion(id: $getQuestionId) {
        id
        author {
            id
            username
        }
        title
        content
        tags {
            id
            name
        }
        images
        votes {
            upvotes
            downvotes
        }
    }
}
`;

export const GET_ANSWERS = gql`
    query GetAnswers($questionId: ID, $pageOptions: PageOptions) {
        getAnswers(questionId: $questionId, pageOptions: $pageOptions) {
            totalPages
            items {
                ... on Answer {
                    id
                    author {
                        id
                        username
                    }
                    content
                    votes {
                        upvotes
                        downvotes
                    }
                    images
                }
            }
        }
    }
`;

export const UPLOAD_IMAGE = gql`
    mutation UploadImage($file: Upload!) {
        uploadImage(file: $file) {
            id
        }
    }
`;

export const CREATE_ANSWER = gql`
    mutation CreateAnswer($questionId: ID!, $content: String!, $imageIds: [ID!]) {
        createAnswer(questionId: $questionId, content: $content, imageIds: $imageIds) {
            id
        }
    }
`;

export const CREATE_QUESTION = gql`
    mutation CreateQuestion($title: String!, $content: String!, $tagIds: [ID!]!, $imageIds: [ID!]) {
        createQuestion(title: $title, content: $content, tagIds: $tagIds, imageIds: $imageIds) {
            id
        }
    }
`;