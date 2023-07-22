import * as React from 'react';

import { ContentBox } from './getPosition.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPosition, GetPositionArgs } from '../../../src';

export const GetPositionTest: React.FunctionComponent<GetPositionArgs> = (
  args,
) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getPosition(args);
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
        title="services/getPosition"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
