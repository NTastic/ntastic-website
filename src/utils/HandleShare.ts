export const handleShare = () => {
    navigator.share({
        title: "NTastic",
        text: "Check out this awesome page!",
        url: window.location.href
    }).then(
        () => console.log("Content shared successfully")
    ).catch(
        (error) => console.log("Error sharing: ", error)
    );
};