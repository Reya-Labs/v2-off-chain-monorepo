import * as React from 'react';

import { ContentBox } from './getPool.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPool, GetPoolArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetPoolTest: React.FunctionComponent<GetPoolArgs> = (args) => {
  const { test, loading, result, error } = useTest<GetPoolArgs>({
    promiseFn: getPool,
    args,
  });

  return (
    <ContentBox>
      <TestPage
        title="services/getPool"
        loading={loading}
        error={error}
        result={result}
        onTestClick={test}
      />
    </ContentBox>
  );
};
