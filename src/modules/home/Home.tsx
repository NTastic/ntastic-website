"use client"
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AdsBoard from "@/modules/home/AdsBoard";
import Categories from "@/modules/home/Categories";
import Recommendations from "@/modules/home/Recommendations";
import { GET_CATEGORIES } from "@/graphql/poi";
import { CategoryValue } from "@/shared/constants/types";
import { useQuery } from "@apollo/client";

const Home: React.FC = () => {
    const [categories, setCategories] = useState<CategoryValue[]>([]);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    useEffect(() => {
        if (categoriesData) {
            const catList: CategoryValue[] = categoriesData.getCategories;
            let categories: (CategoryValue | null)[] = [null, null, null, null];
            for (const cat of catList) {
                if (cat.name == "Restaurant") {
                    categories[0] = cat;
                } else if (cat.name == "Shopping") {
                    categories[1] = cat;
                } else if (cat.name == "Hotel") {
                    categories[2] = cat;
                } else if (cat.name == "Attraction") {
                    categories[3] = cat;
                }
            }
            setCategories(categories.filter((c) => c !== null));
        }
    }, [categoriesData]);

    return (
        <Box
            sx={{
                width: "95%",
                minWidth: 350,
                maxWidth: 800,
                display: "flex",
                flexDirection: "column",
                padding: 1,
                alignItems: "center",
                justifyContent: "space-around"
            }}
        >
            <AdsBoard />
            <Categories categories={categories}/>
            <Recommendations categories={categories}/>
        </Box>
    );
};

export default Home;