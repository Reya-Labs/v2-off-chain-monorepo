import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getMarginAccounts, GetMarginAccountsArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetMarginAccountsTest: React.FunctionComponent<
  GetMarginAccountsArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetMarginAccountsArgs>({
    promiseFn: getMarginAccounts,
    args,
  });

  return (
    <TestPage
      title="services/getMarginAccounts"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
