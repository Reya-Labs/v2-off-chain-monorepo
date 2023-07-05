import * as React from 'react';

import { ContentBox } from './getAllowanceToPeriphery.styled';
import { WalletButton } from '../../../components/WalletButton';
import { WalletContext } from '../../../context/WalletContext';
import {
  getAllowanceToPeriphery,
  GetAllowanceToPeripheryArgs,
} from '../../../../src';
import { TestPage } from '../../../components/TestPage/TestPage';

export const GetAllowanceToPeripheryTest: React.FunctionComponent<{
  ammId: GetAllowanceToPeripheryArgs['ammId'];
}> = ({ ammId }) => {
  const { isLoggedIn, signer } = React.useContext(WalletContext);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');
  const test = async () => {
    if (!signer) {
      alert('Connect Wallet First');
      return;
    }
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getAllowanceToPeriphery({
        ammId,
        signer,
      });
      setTestResult(result);
    } catch (error) {
      setTestError(error);
    } finally {
      setIsTesting(false);
    }
  };
  return (
    <ContentBox>
      <WalletButton />
      {isLoggedIn ? (
        <TestPage
          title="services/getAllowanceToPeriphery"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
