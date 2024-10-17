"use client";
import React from "react";
import POI from "@/modules/category/POI";

const POIPage: React.FC<{
    params: { category_id: string, poi_id: string }
}> = ({ params }) => {
    return <POI categoryId={params.category_id} poiId={params.poi_id}/>;
};

export default POIPage;