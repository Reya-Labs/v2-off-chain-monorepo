import { BigNumber, Signer } from 'ethers';

export type SwapSimulationResults = {
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};

export type SwapParameters = {
  owner: Signer;
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  baseAmount: BigNumber;
  marginAmount: BigNumber;
  priceLimit: BigNumber;
};

export type SwapInfo = {
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  currentLiqudityIndex: number;
};

export type SwapArgs = {
  poolId: string;
  signer: Signer;
  notionalAmount: number;
  marginAmount: number;
  fixedRateLimit: number; // e.g. 0.0125 = 1.25%
};
