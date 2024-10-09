import { styled, keyframes } from '@mui/system';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const spinAnimation = keyframes`
    0% {transform: rotate(0deg)}
    100% {transform: rotate(0deg)}
`;

export const SpinningHourglass = styled(HourglassBottomIcon)(({ theme }) => ({
    animation: `${spinAnimation} 1s linear infinite`,
}));