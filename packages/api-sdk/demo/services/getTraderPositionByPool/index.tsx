import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import {
  getTraderPositionByPool,
  GetTraderPositionByPoolArgs,
} from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetTraderPositionByPoolTest: React.FunctionComponent<
  GetTraderPositionByPoolArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetTraderPositionByPoolArgs>(
    {
      promiseFn: getTraderPositionByPool,
      args,
    },
  );

  return (
    <TestPage
      title="services/getTraderPositionByPool"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
