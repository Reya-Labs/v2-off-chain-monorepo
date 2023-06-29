import * as React from 'react';

import { ContentBox } from './simulateSwap.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { simulateSwap, SwapArgs } from '../../../src';
import { TestPage } from '../../components/TestPage/TestPage';

export const SimulateSwapTest: React.FunctionComponent<{
  ammId: SwapArgs['ammId'];
  notional: SwapArgs['notional'];
  margin: SwapArgs['margin'];
}> = ({ ammId, margin, notional }) => {
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
      const result = await simulateSwap({
        ammId,
        signer,
        notional,
        margin,
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
          title="services/simulateSwap"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
