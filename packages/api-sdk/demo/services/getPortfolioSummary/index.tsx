import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPortfolioSummary, GetPortfolioSummaryArgs } from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetPortfolioSummaryTest: React.FunctionComponent<
  GetPortfolioSummaryArgs
> = (args) => {
  const { test, loading, result, error } = useTest<GetPortfolioSummaryArgs>({
    promiseFn: getPortfolioSummary,
    args,
  });

  return (
    <TestPage
      title="services/getPortfolioSummary"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
