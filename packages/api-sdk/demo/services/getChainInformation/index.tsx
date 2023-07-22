import * as React from 'react';

import { ContentBox } from './getChainInformation.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getChainInformation, GetChainInformationArgs } from '../../../src';

export const GetChainInformationTest: React.FunctionComponent<
  GetChainInformationArgs
> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getChainInformation(args);
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
        title="services/getChainInformation"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
