import { styled, keyframes } from '@mui/system';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const spinAnimation = keyframes`
    0% {transform: rotate(0deg)}
    50% {transform: rotate(180deg)}
    100% {transform: rotate(360deg)}
`;

export const SpinningHourglass = styled(HourglassBottomIcon)(({ theme }) => ({
    animation: `${spinAnimation} 1s linear infinite`,
}));