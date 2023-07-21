import { getTimestampInSeconds, scale } from '@voltz-protocol/commons-v2';
import { EditSwapArgs, CompleteSwapDetails } from './types';
import { getFee } from '../../utils/getFee';
import { getPosition } from '@voltz-protocol/api-sdk-v2';

export const parseEditSwapArgs = async ({
  positionId,
  signer,
  notional,
  margin,
}: EditSwapArgs): Promise<CompleteSwapDetails> => {
  const chainId = await signer.getChainId();
  const positionInfo = await getPosition(positionId, false);

  // Check that signer is connected to the right network
  if (positionInfo.pool.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Decode some information from position
  const quoteTokenDecimals = positionInfo.pool.underlyingToken.tokenDecimals;
  const currentLiquidityIndex = positionInfo.pool.currentLiquidityIndex;

  const maturityTimestamp = getTimestampInSeconds(
    positionInfo.pool.termEndTimestampInMS,
  );

  // Get base amount
  const baseAmount = notional / currentLiquidityIndex;

  // Build parameters
  const params: CompleteSwapDetails = {
    poolId: positionInfo.pool.id,
    chainId,
    signer,

    productAddress: positionInfo.pool.productAddress,
    marketId: positionInfo.pool.marketId,
    fee: scale(quoteTokenDecimals)(
      getFee(notional, positionInfo.pool.takerFee, maturityTimestamp),
    ),
    maturityTimestamp,
    currentLiquidityIndex,

    quoteTokenAddress: positionInfo.pool.underlyingToken.address,
    quoteTokenDecimals,

    inputBase: baseAmount,

    accountId: positionInfo.accountId,
    accountMargin: positionInfo.margin,

    ownerAddress: await signer.getAddress(),

    baseAmount: scale(quoteTokenDecimals)(baseAmount),

    margin: scale(quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(quoteTokenDecimals)(0),
    isETH: positionInfo.pool.underlyingToken.priceUSD > 1,
  };

  console.log('edit swap params:', params);

  return params;
};
