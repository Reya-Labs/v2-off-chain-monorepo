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
  quoteTokenDecimals: number;
  isETH: boolean;
  accountId: string;
  positionMargin: BigNumber;
};

export type UpdateMarginParams = UpdateMarginInfo & {
  owner: Signer;
  margin: BigNumber;
  liquidatorBooster: BigNumber;
};
