export const getTimestampInSeconds = (): number => {
  return Math.floor(Date.now().valueOf() / 1000);
};
