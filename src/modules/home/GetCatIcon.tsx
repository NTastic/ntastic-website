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
    if (category === "Restaurant") {
        return <DinnerDiningIcon sx={iconStyle} />;
    }
    if (category === "Shopping") {
        return <LocalGroceryStoreIcon sx={iconStyle} />;
    }
    if (category === "Hotel") {
        return <BedIcon sx={iconStyle} />;
    }
    if (category === "Attraction") {
        return <AttractionsIcon sx={iconStyle} />;
    }
    if (category === "Cafe") {
        return <LocalCafeIcon sx={iconStyle} />;
    }
    return <TurnedInIcon sx={iconStyle} />;
};

export default GetCategoryIcon;