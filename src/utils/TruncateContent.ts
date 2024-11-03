export const truncateContent = (content: string | null, wordLimit: number) => {
    if (!content || content.length == 0) {
        return "";
    }
    const words = content.split(" ");
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return content;
};