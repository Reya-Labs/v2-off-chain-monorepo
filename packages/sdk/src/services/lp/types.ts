import { BigNumber, Signer } from 'ethers';

export type LpArgs = {
  ammId: string;
  signer: Signer;
  notional: number;
  margin: number;
  fixedHigh: number;
  fixedLow: number;
};

export type EditLpArgs = {
  positionId: string;
  signer: Signer;
  notional: number;
  margin: number;
};

export type EncodeLpArgs = {
  productAddress: string;
  marketId: string;
  maturityTimestamp: number;
  quoteTokenAddress: string;

  accountId: string | undefined;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;

  liquidityAmount: BigNumber;

  margin: BigNumber;
  liquidatorBooster: BigNumber;
  isETH: boolean;
};

export type CompleteLpDetails = EncodeLpArgs & {
  signer: Signer;
  userNotional: number;

  chainId: number;
  poolId: string;

  quoteTokenDecimals: number;
  fee: number;

  accountMargin: number;
};

export type InfoPostLp = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  fee: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};
