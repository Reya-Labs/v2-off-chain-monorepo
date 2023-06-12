export const assert = (condition: boolean, message?: string) => {
  if (condition) {
    return;
  }

  throw new Error(message || 'Assertion failed');
};
