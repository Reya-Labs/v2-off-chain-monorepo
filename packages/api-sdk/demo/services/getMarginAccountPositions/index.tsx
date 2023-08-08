import * as React from 'react';
import { TestPage } from '../../components/TestPage/TestPage';
import {
  getMarginAccountPositions,
  GetMarginAccountPositionsArgs,
} from '../../../src';
import { useTest } from '../../hooks/useTest';

export const GetMarginAccountPositionsTest: React.FunctionComponent<
  GetMarginAccountPositionsArgs
> = (args) => {
  const { test, loading, result, error } =
    useTest<GetMarginAccountPositionsArgs>({
      promiseFn: getMarginAccountPositions,
      args,
    });

  return (
    <TestPage
      title="services/getMarginAccountPositions"
      loading={loading}
      error={error}
      result={result}
      onTestClick={test}
    />
  );
};
