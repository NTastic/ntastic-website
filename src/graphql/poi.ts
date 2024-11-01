import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
    query GetCategories {
        getCategories {
            id
            name
        }
    }
`;

export const GET_SUB_CATEGORIES = gql`
    query Query($parentCatId: ID) {
        getCategories(parentCatId: $parentCatId) {
            id
            name
        }
    }
`;

export const GET_POI_LIST = gql`
    query GetPOIs($catIds: [ID!], $pageOptions: PageOptions) {
        getPOIs(catIds: $catIds, pageOptions: $pageOptions) {
            items {
                ... on POI {
                    id
                    catIds
                    photoUrls
                    votes {
                        upvotes
                    }
                    name
                    rating
                    phone
                    address
                    website
                    workingHours {
                        day
                        time
                    }
                    reviewsCount
                    reviewSummary
                }
            }
        }
    }
`;

export const GET_ONE_POI = gql`
    query GetPOI($getPoiId: ID!) {
        getPOI(id: $getPoiId) {
            id
            name
            photoUrls
            address
            rating
            reviewsCount
            website
            workingHours {
                day
                time
            }
            votes {
                upvotes
            }
        }
    }
`;

export const GET_COMMENTS = gql`
    query GetComments($poiId: ID!, $pageOptions: PageOptions) {
        getComments(poiId: $poiId, pageOptions: $pageOptions) {
            items {
                ... on Comment {
                    id
                    author {
                        id
                        avatar
                        username
                    }
                    content
                    rating
                    votes {
                        upvotes
                    }
                }
            }
        }
    }
`;

export const GET_RECOMMENDATIONS = gql`
    query GetRecommendations($catIds: [ID!], $pageOptions: PageOptions, $location: LocationFilter) {
        getRecommendations(catIds: $catIds, pageOptions: $pageOptions, location: $location) {
            items {
                ... on Recommendation {
                    id
                    title
                    poi {
                        id
                        name
                        address
                        photoUrls
                        rating
                        reviewsCount
                    }
                    catIds
                }
            }
        }
    }
`;

export const GET_ONE_RECOMMENDATION = gql`
    query GetRecommendation($getRecommendationId: ID!) {
        getRecommendation(id: $getRecommendationId) {
            id
            title
            poi {
                id
                name
                address
                photoUrls
                rating
                reviewsCount
            }
        }
    }
`;