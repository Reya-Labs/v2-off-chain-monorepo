import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPools, GetPoolsArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetPoolsTest: React.FunctionComponent<GetPoolsArgs> = (args) => {
  const { test, loading, result, error } = useTest<GetPoolsArgs>({
    promiseFn: getPools,
    args,
  });

  return (
    <TestPage
      title="services/getPools"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
