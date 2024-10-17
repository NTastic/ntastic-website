import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
    query GetCategories {
        getCategories {
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