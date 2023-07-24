import * as React from 'react';

type UseTestArgs<TArgs> = {
  promiseFn: (args: TArgs) => Promise<unknown>;
  args: TArgs;
};
type UseTestResult = {
  loading: boolean;
  error: null | unknown;
  result: string;
  test: () => Promise<void>;
};
export function useTest<TArgs>({
  promiseFn,
  args,
}: UseTestArgs<TArgs>): UseTestResult {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<null | unknown>(null);
  const [result, setResult] = React.useState<string>('');

  const test = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await promiseFn(args);
      setResult(JSON.stringify(result, undefined, 2));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    test,
  };
}
