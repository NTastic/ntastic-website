"use client";
import React from "react";
import POIList from "@/modules/category/POIList";

const CategoryPage: React.FC<{params: {category_id: string}}> = ({params}) => {
    return <POIList categoryId={params.category_id}/>;
};

export default CategoryPage;