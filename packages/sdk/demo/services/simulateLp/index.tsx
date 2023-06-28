import { Button, Typography } from 'brokoli-ui';
import * as React from 'react';

import { ContentBox } from './simulateLp.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { simulateLp, LpArgs } from '../../../src';
import { TestState } from '../../components/TestState';
import { TestPage } from '../../components/TestPage/TestPage';

export const SimulateLpTest: React.FunctionComponent<{
  ammId: LpArgs['ammId'];
  notional: LpArgs['notional'];
  margin: LpArgs['margin'];
  fixedHigh: LpArgs['fixedHigh'];
  fixedLow: LpArgs['fixedLow'];
}> = ({ fixedHigh, fixedLow, ammId, margin, notional }) => {
  const { isLoggedIn, signer } = React.useContext(WalletContext);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState('');
  const [testResult, setTestResult] = React.useState('');
  const test = async () => {
    if (!signer) {
      alert('Connect Wallet First');
      return;
    }
    setIsTesting(true);
    try {
      const result = await simulateLp({
        ammId,
        signer,
        notional,
        margin,
        fixedLow,
        fixedHigh,
      });
      setTestResult(JSON.stringify(result));
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
          title="services/simulateLp"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};