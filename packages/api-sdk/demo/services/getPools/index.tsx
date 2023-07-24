import * as React from 'react';

import { ContentBox } from './getPools.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPools, GetPoolsArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetPoolsTest: React.FunctionComponent<GetPoolsArgs> = (args) => {
  const { test, loading, result, error } = useTest<GetPoolsArgs>({
    promiseFn: getPools,
    args,
  });

  return (
    <ContentBox>
      <TestPage
        title="services/getPools"
        loading={loading}
        error={error}
        result={result}
        onTestClick={test}
      />
    </ContentBox>
  );
};
