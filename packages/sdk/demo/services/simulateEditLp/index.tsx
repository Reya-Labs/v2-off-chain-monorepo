import { Button, Typography } from 'brokoli-ui';
import * as React from 'react';

import { ContentBox } from './simulateEditLp.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { simulateEditLp, EditLpArgs } from '../../../src';
import { TestState } from '../../components/TestState';
import { TestPage } from '../../components/TestPage/TestPage';

export const SimulateEditLpTest: React.FunctionComponent<{
  positionId: EditLpArgs['positionId'];
  notional: EditLpArgs['notional'];
  margin: EditLpArgs['margin'];
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
      const result = await simulateEditLp({
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
          title="services/simulateEditLp"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
