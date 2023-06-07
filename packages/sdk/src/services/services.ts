import { Signer } from 'ethers';
import { SettleTradeMaker, TakerTrade } from '../utils/types';
import { settle } from './send';

type Position = {
  chainId: number; // replace by supportedChainID
  positionId: string;
  marketId: string;
  maturityTimestamp: number;
  quoteToken: string;
  productAddress: string;
  accountId: string;
  collateralAmount: number;
  tickLower?: number;
  tickUpper?: number;
};

function getMockPosition(positionId: string): Position {
  return {
    chainId: 1,
    positionId: 'mockPosition',
    marketId: 'mockMarketID',
    maturityTimestamp: 1675777000,
    quoteToken: '0x0000000000000000000000000000000000000000',
    productAddress: '0x0000000000000000000000000000000000000000',
    accountId: '128636',
    collateralAmount: 100,
  };
}

export async function settlePosition(signer: Signer, positionId: string) {
  // axios send re to api
  const position = getMockPosition(positionId);

  const order: SettleTradeMaker = {
    owner: signer,
    productAddress: position.productAddress,
    maturityTimestamp: position.maturityTimestamp,
    marketId: position.marketId,
    quoteTokenAddress: position.quoteToken,
    accountId: position.accountId,
  };
  const withdrawTrade: TakerTrade = {
    ...order,
    marginAmount: position.collateralAmount,
    baseAmount: 0,
  };
  await settle(withdrawTrade, position.chainId);
}
