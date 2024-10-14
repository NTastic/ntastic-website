"use client";
import React, { useEffect } from "react";
import { RouteConfig } from "@/routes/route";

const CategoryPage: React.FC<{params: {category: string}}> = ({params}) => {
    const metadata = RouteConfig.Category(params. category).Metadata;

    useEffect(() => {
        document.title = metadata.title;
    }, [metadata.title]);

    return <>{params.category} Page</>;
};

export default CategoryPage;