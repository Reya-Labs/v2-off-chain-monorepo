import * as React from 'react';

import { ContentBox } from './getPositions.styled';
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
    <ContentBox>
      <TestPage
        title="services/getPositions"
        loading={loading}
        error={error}
        result={result}
        onTestClick={test}
      />
    </ContentBox>
  );
};
