import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { BasePool, Tokens } from '../../types';

export type GetMarginAccountsForSwapLPArgs = {
  chainIds: number[];
  ownerAddress: string;
  poolId: BasePool['id'];
};

// if settlementToken is present the balance, initialMarginPreTrade... etc. should be in that token
// if settlementToken is null then balance, initialMarginPreTrade... etc. should be in the underlying token of the pool
export type MarginAccountForSwapLP = {
  id: string;
  chainId: SupportedChainId;
  name: string;
  balance: number;
  initialMarginPreTrade: number;
  settlementToken?: Tokens | null;
};

export type GetMarginAccountsForSwapLPResponse = {
  marginAccounts: MarginAccountForSwapLP[];
};
