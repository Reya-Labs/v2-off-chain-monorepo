import * as React from 'react';

import { ContentBox } from './getAvailableNotional.styled';
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
    <ContentBox>
      <TestPage
        title="services/getAvailableNotional"
        loading={loading}
        error={error}
        result={result}
        onTestClick={test}
      />
    </ContentBox>
  );
};
