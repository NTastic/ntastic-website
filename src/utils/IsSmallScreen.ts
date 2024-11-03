import { useTheme, useMediaQuery } from "@mui/material";

export const isSmallScreen = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")) ? true : false;
    return isSmallScreen;
};