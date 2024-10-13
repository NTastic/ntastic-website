"use client";
import React, { useEffect } from "react";
import { RouteConfig } from "@/routes/route";

const POIPage: React.FC<{
    params: {category: string, poi_id: string}
}> = ({params}) => {
    const metadata = RouteConfig.POI(params. category, params.poi_id).Metadata;

    useEffect(() => {
        document.title = metadata.title;
    }, [metadata.title]);

    return <>{params.category} Page: {params.poi_id}</>;
};

export default POIPage;