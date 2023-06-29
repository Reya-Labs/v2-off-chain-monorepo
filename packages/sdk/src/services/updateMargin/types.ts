import { Signer, BigNumber } from 'ethers';

export type UpdateMarginArgs = {
  positionId: string;
  signer: Signer;
  margin: number;
};

export type UpdateMarginParams = {
  chainId: number;
  quoteTokenAddress: string;
  quoteTokenDecimals: number;
  isETH: boolean;
  accountId: string;

  margin: BigNumber;
  liquidatorBooster: BigNumber;
};
