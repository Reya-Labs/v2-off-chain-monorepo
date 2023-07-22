import * as React from 'react';

import { ContentBox } from './getLpPositionsByPool.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import {
  getLpPositionsByPool,
  GetTraderPositionByPoolArgs,
} from '../../../src';

export const GetLpPositionsByPoolTest: React.FunctionComponent<
  GetTraderPositionByPoolArgs
> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getLpPositionsByPool(args);
      setTestResult(result);
    } catch (error) {
      setTestError(error);
    } finally {
      setIsTesting(false);
    }
  };
  return (
    <ContentBox>
      <TestPage
        title="services/getLpPositionsByPool"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
