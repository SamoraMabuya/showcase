export const shortenText = (text: string, maxLengthOfText: number) => {
  if (text.length <= maxLengthOfText) {
    return text;
  } else {
    if (text.length <= 0) {
      return null;
    }
  }
  return text.slice(0, maxLengthOfText) + "...";
};
