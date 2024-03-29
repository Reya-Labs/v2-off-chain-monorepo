import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPosition, GetPositionArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetPositionTest: React.FunctionComponent<GetPositionArgs> = (
  args,
) => {
  const { test, loading, result, error } = useTest<GetPositionArgs>({
    promiseFn: getPosition,
    args,
  });

  return (
    <TestPage
      title="services/getPosition"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
