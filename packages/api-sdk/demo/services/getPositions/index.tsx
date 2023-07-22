import * as React from 'react';

import { ContentBox } from './getPositions.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPositions, GetPositionsArgs } from '../../../src';

export const GetPositionsTest: React.FunctionComponent<GetPositionsArgs> = (
  args,
) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getPositions(args);
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
        title="services/getPositions"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
