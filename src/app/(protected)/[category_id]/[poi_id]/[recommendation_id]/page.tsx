"use client";
import React, { useEffect } from "react";
import { RouteConfig } from "@/routes/route";
import Recommendation from "@/modules/category/Recommendation";

const RecommendationPage: React.FC<{
    params: {
        category_id: string,
        poi_id: string,
        recommendation_id: string
    }
}> = ({ params }) => {
    const metadata = RouteConfig.Recommendation(
        params.category_id, 
        "",
        params.poi_id, 
        params.recommendation_id
    ).Metadata;

    useEffect(() => {
        document.title = metadata.title;
    }, [metadata.title]);

    return (
        <Recommendation
            category={params.category_id}
            poi_id={params.poi_id}
            recommendation_id={params.recommendation_id}
        />
    );
};

export default RecommendationPage;