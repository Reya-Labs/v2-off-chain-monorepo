export const fetchMultiplePromises = async <T>(
  promises: Promise<T>[],
): Promise<{
  data: T[];
  isError: boolean;
  error: any;
}> => {
  const responses = await Promise.allSettled(promises);

  const data = responses
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<Awaited<T>>).value);

  const failure = responses.find((r) => r.status === 'rejected');

  if (failure) {
    return {
      data,
      isError: true,
      error: (failure as PromiseRejectedResult).reason,
    };
  }

  return {
    data,
    isError: false,
    error: null,
  };
};
