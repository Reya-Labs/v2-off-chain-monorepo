import * as React from 'react';

import { ContentBox } from './getPoolSwapInfo.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { TestPage } from '../../components/TestPage/TestPage';
import { SwapArgs } from '../../../src/services/swap';
import { getPoolSwapInfo } from '../../../src/services/poolSwapInfo';

export const GetPoolSwapInfoTest: React.FunctionComponent<
  Omit<SwapArgs, 'margin'>
> = ({ ammId }) => {
  const { isLoggedIn, provider } = React.useContext(WalletContext);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<null | unknown>(null);
  const [testResult, setTestResult] = React.useState<any>('');

  const test = async () => {
    if (!provider) {
      alert('Connect Wallet First');
      return;
    }
    setIsTesting(true);
    setTestError(null);
    try {
      const result = await getPoolSwapInfo(ammId);
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
          title="services/getPoolSwapInfo"
          loading={isTesting}
          error={testError}
          result={testResult}
          onTestClick={test}
        />
      ) : null}
    </ContentBox>
  );
};
