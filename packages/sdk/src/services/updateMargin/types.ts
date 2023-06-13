import { Signer, BigNumber } from 'ethers';

export type UpdateMarginArgs = {
  positionId: string;
  signer: Signer;
  margin: number;
};

export type UpdateMarginInfo = {
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  accountId: string;
  positionMarginAmount: BigNumber;
};

export type UpdateMarginParams = {
  owner: Signer;
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  accountId: string;
  margin: BigNumber;
};
