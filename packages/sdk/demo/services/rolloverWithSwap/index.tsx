import * as React from 'react';

import { ContentBox } from './rolloverWithSwap.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { rolloverWithSwap, RolloverWithSwapArgs } from '../../../src';
import { TestPage } from '../../components/TestPage/TestPage';

export const RolloverWithSwapTest: React.FunctionComponent<{
  ammId: RolloverWithSwapArgs['ammId'];
  maturedPositionId: RolloverWithSwapArgs['maturedPositionId'];
  notional: RolloverWithSwapArgs['notional'];
  margin: RolloverWithSwapArgs['margin'];
}> = ({ maturedPositionId, ammId, margin, notional }) => {
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
      const result = await rolloverWithSwap({
        ammId,
        signer,
        maturedPositionId,
        notional,
        margin,
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
          title="services/rolloverWithSwap"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
