import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import {
  getLpPositionsByPool,
  GetTraderPositionByPoolArgs,
} from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetLpPositionsByPoolTest: React.FunctionComponent<
  GetTraderPositionByPoolArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetTraderPositionByPoolArgs>(
    {
      promiseFn: getLpPositionsByPool,
      args,
    },
  );

  return (
    <TestPage
      title="services/getLpPositionsByPool"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
