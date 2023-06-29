export const fetchMultiplePromises = async <T>(
  promises: Promise<T>[],
  requireSuccess = false,
): Promise<T[]> => {
  const responses = await Promise.allSettled(promises);

  if (requireSuccess) {
    return responses.map((r) => {
      if (r.status === 'rejected') {
        throw r.reason;
      }
      return r.value;
    });
  } else {
    return responses
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<T>).value);
  }
};
