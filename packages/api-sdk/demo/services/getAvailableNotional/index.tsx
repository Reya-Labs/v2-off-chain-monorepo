import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getAvailableNotional, GetAvailableNotionalArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetAvailableNotionalTest: React.FunctionComponent<
  GetAvailableNotionalArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetAvailableNotionalArgs>({
    promiseFn: getAvailableNotional,
    args,
  });
  return (
    <TestPage
      title="services/getAvailableNotional"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
