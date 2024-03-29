import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getChainInformation, GetChainInformationArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetChainInformationTest: React.FunctionComponent<
  GetChainInformationArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetChainInformationArgs>({
    promiseFn: getChainInformation,
    args,
  });
  return (
    <TestPage
      title="services/getChainInformation"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
