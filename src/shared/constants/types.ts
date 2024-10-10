export type QuestionsValue = {
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
    images: Array<string>;
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

export type QuestionValue = {
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

export type AnswerValue = {
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

export type RelatedQuestionValue = {
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