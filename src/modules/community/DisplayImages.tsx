import React from "react";
import Grid from "@mui/material/Grid2"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

interface Props {
    images: Array<string>;
    height: number;
};

const DisplayImages: React.FC<Props> = ({ images, height }) => {
    const imageCount = images.length;
    let colNum: number;
    let rowNum: number;

    switch (imageCount) {
        case 1:
            colNum = 1;
            break;
        case 5:
            colNum = 3;
            break;
        case 6:
            colNum = 3;
            break;
        default:
            colNum = 2;
            break;
    };

    switch (imageCount) {
        case 1:
            rowNum = 1;
            break;
        case 2:
            rowNum = 1;
            break;
        default:
            rowNum = 2;
            break;
    };

    return (
        <ImageList
            cols={colNum}
            rowHeight={height / rowNum}
            sx={{ width: "100%", height: height }}
        >
            {images.map((image) => (
                <ImageListItem key={image}>
                    <img
                        src={image}
                        style={{
                            height: height / rowNum,
                            width: 'auto',
                            display: 'block',
                            margin: 'auto',
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default DisplayImages;