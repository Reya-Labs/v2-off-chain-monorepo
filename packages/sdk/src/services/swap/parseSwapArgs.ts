import { getTimestampInSeconds, scale } from '@voltz-protocol/commons-v2';
import { CompleteSwapDetails, SwapArgs } from './types';
import { getFee } from '../../utils/getFee';
import { getPool } from '@voltz-protocol/api-sdk-v2';

export const parseSwapArgs = async ({
  ammId,
  signer,
  notional,
  margin,
}: SwapArgs): Promise<CompleteSwapDetails> => {
  const chainId = await signer.getChainId();
  const poolInfo = await getPool({ poolId: ammId });

  // Check that signer is connected to the right network
  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Decode some information from pool
  const quoteTokenDecimals = poolInfo.underlyingToken.tokenDecimals;
  const currentLiquidityIndex = poolInfo.currentLiquidityIndex;

  const maturityTimestamp = getTimestampInSeconds(
    poolInfo.termEndTimestampInMS,
  );

  // Get base amount
  const baseAmount = notional / currentLiquidityIndex;

  // Build parameters
  const params: CompleteSwapDetails = {
    chainId,
    signer,

    poolId: poolInfo.id,

    productAddress: poolInfo.productAddress,
    marketId: poolInfo.marketId,
    fee: scale(quoteTokenDecimals)(
      getFee(notional, poolInfo.takerFee, maturityTimestamp),
    ),
    maturityTimestamp,
    currentLiquidityIndex,

    quoteTokenAddress: poolInfo.underlyingToken.address,
    quoteTokenDecimals,

    accountId: undefined,
    accountMargin: 0,

    inputBase: baseAmount,

    ownerAddress: await signer.getAddress(),

    baseAmount: scale(quoteTokenDecimals)(baseAmount),

    margin: scale(quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(quoteTokenDecimals)(1),
    isETH: poolInfo.underlyingToken.priceUSD > 1,
  };

  console.log('swap params:', params);

  return params;
};
