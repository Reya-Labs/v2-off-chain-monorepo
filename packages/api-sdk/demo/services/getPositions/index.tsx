import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPositions, GetPositionsArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetPositionsTest: React.FunctionComponent<GetPositionsArgs> = (
  args,
) => {
  const { test, loading, result, error } = useTest<GetPositionsArgs>({
    promiseFn: getPositions,
    args,
  });

  return (
    <TestPage
      title="services/getPositions"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
