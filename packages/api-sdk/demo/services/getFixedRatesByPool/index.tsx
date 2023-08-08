import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getFixedRatesByPool, GetFixedRatesByPoolArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetFixedRatesByPoolTest: React.FunctionComponent<
  GetFixedRatesByPoolArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetFixedRatesByPoolArgs>({
    promiseFn: getFixedRatesByPool,
    args,
  });
  return (
    <TestPage
      title="services/getFixedRatesByPool"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
