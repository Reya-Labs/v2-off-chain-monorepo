import { Button, Typography } from 'brokoli-ui';
import * as React from 'react';

import { ButtonBox, PageContentBox, ContentBox } from './rolloverWithLp.styled';
import { WalletButton } from '../../components/WalletButton';
import { WalletContext } from '../../context/WalletContext';
import { rolloverWithLp, RolloverWithLpArgs } from '../../../src';
import { TestState } from '../../components/TestState';

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
  const [testError, setTestError] = React.useState('');
  const [testResult, setTestResult] = React.useState('');
  const test = async () => {
    if (!signer) {
      alert('Connect Wallet First');
      return;
    }
    setIsTesting(true);
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
        <PageContentBox>
          <Typography
            colorToken="lavenderWeb"
            typographyToken="primaryHeader1Black"
          >
            services/rolloverWithLp
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
