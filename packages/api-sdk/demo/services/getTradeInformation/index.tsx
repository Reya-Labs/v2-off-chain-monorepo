import * as React from 'react';

import { ContentBox } from './getTradeInformation.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getTradeInformation, GetTradeInformationArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetTradeInformationTest: React.FunctionComponent<
  GetTradeInformationArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetTradeInformationArgs>({
    promiseFn: getTradeInformation,
    args,
  });

  return (
    <ContentBox>
      <TestPage
        title="services/GetTradeInformation"
        loading={loading}
        error={error}
        result={result}
        onTestClick={test}
      />
    </ContentBox>
  );
};
