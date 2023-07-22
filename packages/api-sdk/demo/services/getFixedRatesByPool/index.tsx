import * as React from 'react';

import { ContentBox } from './getFixedRatesByPool.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getFixedRatesByPool, GetFixedRatesByPoolArgs } from '../../../src';

export const GetFixedRatesByPoolTest: React.FunctionComponent<
  GetFixedRatesByPoolArgs
> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getFixedRatesByPool(args);
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
        title="services/getFixedRatesByPool"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
