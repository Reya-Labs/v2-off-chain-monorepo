import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import {
  getVariableRatesByPool,
  GetVariableRatesByPoolArgs,
} from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetVariableRatesByPoolTest: React.FunctionComponent<
  GetVariableRatesByPoolArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetVariableRatesByPoolArgs>({
    promiseFn: getVariableRatesByPool,
    args,
  });

  return (
    <TestPage
      title="services/getVariableRatesByPool"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
