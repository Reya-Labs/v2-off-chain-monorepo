import * as React from 'react';

import { ContentBox } from './getPoolLpInfo.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { getPoolLpInfo, GetPoolLpInfoArgs } from '../../../src';
import { TestPage } from '../../components/TestPage/TestPage';

export const GetPoolLpInfoTest: React.FunctionComponent<{
  ammId: GetPoolLpInfoArgs['ammId'];
  fixedHigh: GetPoolLpInfoArgs['fixedHigh'];
  fixedLow: GetPoolLpInfoArgs['fixedLow'];
}> = ({ ammId, fixedHigh, fixedLow }) => {
  const { isLoggedIn, provider } = React.useContext(WalletContext);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState('');
  const [testResult, setTestResult] = React.useState('');
  const test = async () => {
    if (!provider) {
      alert('Connect Wallet First');
      return;
    }
    setIsTesting(true);
    try {
      const result = await getPoolLpInfo({
        ammId,
        provider,
        fixedHigh,
        fixedLow,
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
          title="services/getPoolLpInfo"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
