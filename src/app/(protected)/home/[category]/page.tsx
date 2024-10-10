import React from "react";

const CategoryPage: React.FC<{params: {category: string}}> = ({params}) => {
    return <>{params.category} Page</>;
};

export default CategoryPage;