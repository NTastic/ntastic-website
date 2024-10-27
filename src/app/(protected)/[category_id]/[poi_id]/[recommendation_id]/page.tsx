import React from "react";
import Recommendation from "@/modules/category/Recommendation";

const RecommendationPage: React.FC<{
    params: {
        category_id: string,
        poi_id: string,
        recommendation_id: string
    }
}> = ({ params }) => {
    return (
        <Recommendation
            category_id={params.category_id}
            poi_id={params.poi_id}
            recommendation_id={params.recommendation_id}
        />
    );
};

export default RecommendationPage;