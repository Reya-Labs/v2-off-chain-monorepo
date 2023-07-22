import * as React from 'react';

import { ContentBox } from './getAvailableNotional.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getAvailableNotional, GetAvailableNotionalArgs } from '../../../src';

export const GetAvailableNotionalTest: React.FunctionComponent<
  GetAvailableNotionalArgs
> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getAvailableNotional(args);
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
        title="services/getAvailableNotional"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
