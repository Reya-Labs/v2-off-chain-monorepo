export const getTimestampInSeconds = (
  timeInMS = Date.now().valueOf(),
): number => {
  return Math.floor(timeInMS / 1000);
};
