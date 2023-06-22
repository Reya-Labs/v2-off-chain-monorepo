import { WalletConnectButton } from 'brokoli-ui';
import * as React from 'react';
import * as detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import styled from '@emotion/styled';
import { WalletContext } from '../../context/WalletContext';

const TopNavBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const WalletButton: React.FunctionComponent = () => {
  const { account, error, loading, connect } = React.useContext(WalletContext);

  return (
    <TopNavBox>
      <WalletConnectButton
        account={account}
        error={error}
        loading={loading}
        onClick={() => void connect()}
      />
    </TopNavBox>
  );
};
