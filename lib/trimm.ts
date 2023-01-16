export const trimm = (str: string, maxLength: number) => {
  if (!str) return "";
  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + "...";
};
