import { getLiquidityFromBase, scale } from '@voltz-protocol/commons-v2';
import { CompleteLpDetails, EditLpArgs } from './types';
import { getPositionInfo } from '../../gateway/getPositionInfo';

export const parseEditLpArgs = async ({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<CompleteLpDetails> => {
  const positionInfo = await getPositionInfo(positionId);
  const chainId = await signer.getChainId();

  // Check that signer is connected to the right network
  if (positionInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Get liquidity amount
  const base = notional / positionInfo.currentLiquidityIndex;
  const liquidityAmount = getLiquidityFromBase(
    base,
    positionInfo.tickLower,
    positionInfo.tickUpper,
  );

  // Build parameters
  const params: CompleteLpDetails = {
    chainId,
    signer,

    productAddress: positionInfo.productAddress,
    marketId: positionInfo.marketId,
    maturityTimestamp: positionInfo.maturityTimestamp,

    quoteTokenAddress: positionInfo.quoteTokenAddress,
    quoteTokenDecimals: positionInfo.quoteTokenDecimals,

    accountId: positionInfo.accountId,
    accountMargin: positionInfo.positionMargin,

    ownerAddress: await signer.getAddress(),
    tickLower: positionInfo.tickLower,
    tickUpper: positionInfo.tickUpper,

    liquidityAmount: scale(positionInfo.quoteTokenDecimals)(liquidityAmount),

    margin: scale(positionInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(positionInfo.quoteTokenDecimals)(0),
    isETH: positionInfo.isETH,
  };

  console.log('edit lp params:', params);

  return params;
};
