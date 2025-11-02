export const getDifferenceInDays = (date1: string, date2: string) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();

  const diffDays = (d2 - d1) / (1000 * 60 * 60 * 24);

  return diffDays
};

export const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};
