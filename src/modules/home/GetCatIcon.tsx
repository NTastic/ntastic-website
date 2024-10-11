import React from 'react';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import BedIcon from '@mui/icons-material/Bed';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const iconStyle = {
    width: "60%",
    height: "60%"
}

const GetCategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    if (category === "Restaurants") {
        return <DinnerDiningIcon sx={iconStyle} />;
    }
    if (category === "Groceries") {
        return <LocalGroceryStoreIcon sx={iconStyle} />;
    }
    if (category === "Hotels") {
        return <BedIcon sx={iconStyle} />;
    }
    if (category === "Attractions") {
        return <AttractionsIcon sx={iconStyle} />;
    }
    if (category === "Cafe") {
        return <LocalCafeIcon sx={iconStyle} />;
    }
    return <TurnedInIcon sx={iconStyle} />;
};

export default GetCategoryIcon;