import * as React from 'react';

import { ContentBox } from './getTradeInformation.styled';
import { TestPage } from '../../components/TestPage/TestPage';
import { getTradeInformation, GetTradeInformationArgs } from '../../../src';

export const GetTradeInformationTest: React.FunctionComponent<
  GetTradeInformationArgs
> = (args) => {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getTradeInformation(args);
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
        title="services/GetTradeInformation"
        loading={isTesting}
        error={testError}
        result={testResult}
        onTestClick={test}
      />
    </ContentBox>
  );
};
