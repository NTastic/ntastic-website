export const truncateContent = (content: string, wordLimit: number) => {
    const words = content.split(" ");
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return content;
};