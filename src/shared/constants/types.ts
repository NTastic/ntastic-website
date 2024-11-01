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

export type CategoryValue = {
    id: string;
    name: string;
};

export type POIListItemValue = {
    id: string;
    catIds: Array<string>;
    photoUrls: Array<string>;
    votes: {
        upvotes: number;
    };
    name: string;
    rating: number;
    phone: string | null;
    address: string;
    website: string | null;
    workingHours: Array<{
        day: string;
        time: string;
    }>;
    reviewsCount: number;
    reviewSummary: string;
};

export type POIValue = {
    id: string;
    name: string;
    address: string | null;
    rating: number | null;
    reviewsCount: number | null;
    website: string | null;
    workingHours: Array<{
        day: string;
        time: string;
    }>;
    votes: {
        upvotes: number;
    };
};

export type CommentValue = {
    id: string;
    author: {
        id: string;
        avatar: string;
        username: string;
    };
    content: string;
    rating: number;
    votes: {
        upvotes: number;
    };
};

export type RecommendationValue = {
    id: string;
    title: string;
    poi: {
        id: string;
        name: string;
        address: string;
        photoUrls: Array<string>;
        rating: number;
        reviewsCount: number;
    }
    catIds: Array<string>;
};

export type UserValue = {
    id: string;
    avatar: string | null;
    username: string;
    description: string | null;
};

export type ProfileQuestionValue = {
    id: string;
    author: {
        id: string;
        avatar: string | null;
        username: string;
    };
    title: string;
    content: string;
    answers: {
        totalItems: number;
    };
    votes: {
        upvotes: number;
    };
};

export type ProfileAnswerValue = {
    id: string;
    question: {
        id: string;
        author: {
            id: string;
            avatar: string | null;
            username: string;
        };
        title: string;
        content: string;
    };
    content: string;
    votes: {
        upvotes: number;
    };
};