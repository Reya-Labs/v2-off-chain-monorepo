import { BigNumber, Signer } from 'ethers';

export type SwapArgs = {
  ammId: string;
  signer: Signer;
  notional: number;
  margin: number;
};

export type SwapMarginAccountArgs = {
  ammId: string;
  signer: Signer;
  notional: number;
  marginAccountId: string;
};

export type EditSwapArgs = {
  positionId: string;
  signer: Signer;
  notional: number;
  margin: number;
};

export type EncodeSwapArgs = {
  productAddress: string;
  marketId: string;
  maturityTimestamp: number;
  quoteTokenAddress: string;

  accountId: string | undefined;
  ownerAddress: string;

  baseAmount: BigNumber;

  margin: BigNumber;
  fee: BigNumber;
  liquidatorBooster: BigNumber;
  isETH: boolean;
};

export type CompleteSwapDetails = EncodeSwapArgs & {
  signer: Signer;

  chainId: number;
  poolId: string;

  quoteTokenDecimals: number;
  currentLiquidityIndex: number;

  inputBase: number;

  accountMargin: number;
};

export type InfoPostSwap = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  fee: number;
  averageFixedRate: number;
  variableTokenDeltaBalance: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX' | 'USDCf';
  };
};

export type SimulateSwapMarginAccountResult = {
  accountInitialMarginPostTrade: number;
  marginRequirement: number;
  maxMarginWithdrawable: number;
  fee: number;
  averageFixedRate: number;
  variableTokenDeltaBalance: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX' | 'USDCf';
  };
};
