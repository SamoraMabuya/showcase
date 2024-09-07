export const shortenText = (text: string, maxLengthOfText: number) => {
  if (text.length <= maxLengthOfText) {
    return text;
  }
  return text.slice(0, maxLengthOfText) + "...";
};
