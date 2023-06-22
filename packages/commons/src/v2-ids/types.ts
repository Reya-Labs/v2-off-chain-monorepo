import { SupportedChainId } from '../provider';

export type V2PoolIdData = {
  chainId: SupportedChainId;
  marketId: string;
  maturityTimestamp: number;
};

export type V2PositionIdData = {
  chainId: SupportedChainId;
  accountId: string;
  marketId: string;
  maturityTimestamp: number;
  type: 'trader' | 'lp';

  tickLower?: number;
  tickUpper?: number;
};
