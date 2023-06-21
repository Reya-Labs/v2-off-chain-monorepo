import { Button, Typography } from 'brokoli-ui';
import * as React from 'react';

import { ButtonBox, PageContentBox, ContentBox } from './getPoolLpInfo.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { getPoolLpInfo, GetPoolLpInfoArgs } from '../../../src';
import { TestState } from '../../components/TestState';

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
        <PageContentBox>
          <Typography
            colorToken="lavenderWeb"
            typographyToken="primaryHeader1Black"
          >
            services/getPoolLpInfo
          </Typography>
          <TestState
            loading={isTesting}
            error={testError}
            result={testResult}
          />
          <ButtonBox>
            <Button variant="primary" onClick={test}>
              Test
            </Button>
          </ButtonBox>
        </PageContentBox>
      ) : null}
    </ContentBox>
  );
};
