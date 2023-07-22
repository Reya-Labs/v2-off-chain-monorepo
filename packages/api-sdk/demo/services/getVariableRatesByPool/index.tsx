import * as React from 'react';

import { ContentBox } from './getVariableRatesByPool.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import {
  getVariableRatesByPool,
  GetVariableRatesByPoolArgs,
} from '../../../src';

export const GetVariableRatesByPoolTest: React.FunctionComponent<
  GetVariableRatesByPoolArgs
> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getVariableRatesByPool(args);
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
        title="services/getVariableRatesByPool"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
