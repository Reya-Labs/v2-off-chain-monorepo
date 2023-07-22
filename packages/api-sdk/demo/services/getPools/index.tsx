import * as React from 'react';

import { ContentBox } from './getPools.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getPools, GetPoolsArgs } from '../../../src';

export const GetPoolsTest: React.FunctionComponent<GetPoolsArgs> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getPools(args);
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
        title="services/getPools"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
