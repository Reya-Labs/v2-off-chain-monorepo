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
  if (positionInfo.pool.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Decode some information from position
  const quoteTokenDecimals = positionInfo.pool.underlyingToken.tokenDecimals;
  const currentLiquidityIndex = positionInfo.pool.currentLiquidityIndex;

  const maturityTimestamp = Math.round(
    positionInfo.pool.termEndTimestampInMS / 1000,
  );

  // Get liquidity amount
  const base = notional / currentLiquidityIndex;
  const liquidityAmount = getLiquidityFromBase(
    base,
    positionInfo.tickLower,
    positionInfo.tickUpper,
  );

  // Build parameters
  const params: CompleteLpDetails = {
    chainId,
    signer,

    poolId: positionInfo.pool.id,

    productAddress: positionInfo.pool.productAddress,
    marketId: positionInfo.pool.marketId,
    maturityTimestamp,
    fee: 0, // todo: replace by pool.makerFee

    quoteTokenAddress: positionInfo.pool.underlyingToken.address,
    quoteTokenDecimals,

    accountId: positionInfo.accountId,
    accountMargin: positionInfo.margin,

    ownerAddress: await signer.getAddress(),
    tickLower: positionInfo.tickLower,
    tickUpper: positionInfo.tickUpper,

    userNotional: notional,

    liquidityAmount: scale(quoteTokenDecimals)(liquidityAmount),

    margin: scale(quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(quoteTokenDecimals)(0),
    isETH: positionInfo.pool.underlyingToken.priceUSD > 1,
  };

  console.log('edit lp params:', params);

  return params;
};
