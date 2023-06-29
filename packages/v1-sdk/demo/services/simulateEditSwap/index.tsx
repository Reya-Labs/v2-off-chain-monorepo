import * as React from 'react';

import { ContentBox } from './simulateEditSwap.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { simulateEditSwap, EditSwapArgs } from '../../../src';
import { TestPage } from '../../components/TestPage/TestPage';

export const SimulateEditSwapTest: React.FunctionComponent<{
  positionId: EditSwapArgs['positionId'];
  notional: EditSwapArgs['notional'];
  margin: EditSwapArgs['margin'];
}> = ({ positionId, margin, notional }) => {
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
      const result = await simulateEditSwap({
        positionId,
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
          title="services/simulateEditSwap"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
