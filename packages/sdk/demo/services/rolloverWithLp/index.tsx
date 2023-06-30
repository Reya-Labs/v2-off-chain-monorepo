import * as React from 'react';

import { ContentBox } from './rolloverWithLp.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { rolloverWithLp, RolloverWithLpArgs } from '../../../src';
import { TestPage } from '../../components/TestPage/TestPage';

export const RolloverWithLpTest: React.FunctionComponent<{
  ammId: RolloverWithLpArgs['ammId'];
  maturedPositionId: RolloverWithLpArgs['maturedPositionId'];
  notional: RolloverWithLpArgs['notional'];
  margin: RolloverWithLpArgs['margin'];
  fixedHigh: RolloverWithLpArgs['fixedHigh'];
  fixedLow: RolloverWithLpArgs['fixedLow'];
}> = ({ maturedPositionId, fixedHigh, fixedLow, ammId, margin, notional }) => {
  const { isLoggedIn, signer } = React.useContext(WalletContext);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState('');
  const test = async () => {
    if (!signer) {
      alert('Connect Wallet First');
      return;
    }
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await rolloverWithLp({
        ammId,
        signer,
        maturedPositionId,
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
          title="services/rolloverWithLp"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
