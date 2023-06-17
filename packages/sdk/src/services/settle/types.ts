import { BigNumber, Signer } from 'ethers';

export type SettleSimulationResults = {
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};

export type SettleParameters = {
  owner: Signer;
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  accountId: string;
  margin: BigNumber;
};

export type SettleInfo = {
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  accountId: string;
  margin: BigNumber;
};

export type SettleArgs = {
  positionId: string;
  signer: Signer;
};
