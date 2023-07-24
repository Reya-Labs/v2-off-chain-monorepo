import * as React from 'react';

import { ContentBox } from './getVariableRatesByPool.styled';
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
    <ContentBox>
      <TestPage
        title="services/getVariableRatesByPool"
        loading={loading}
        error={error}
        result={result}
        onTestClick={test}
      />
    </ContentBox>
  );
};
