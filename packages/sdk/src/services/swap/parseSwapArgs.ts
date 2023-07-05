import { scale } from '@voltz-protocol/commons-v2';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { SwapArgs, CompleteSwapDetails } from './types';

export const parseSwapArgs = async ({
  ammId,
  signer,
  notional,
  margin,
}: SwapArgs): Promise<CompleteSwapDetails> => {
  const chainId = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);

  // Check that signer is connected to the right network
  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Get base amount
  const baseAmount = notional / poolInfo.currentLiquidityIndex;

  // Build parameters
  const params: CompleteSwapDetails = {
    chainId,
    signer,

    productAddress: poolInfo.productAddress,
    marketId: poolInfo.marketId,
    maturityTimestamp: poolInfo.maturityTimestamp,
    currentLiquidityIndex: poolInfo.currentLiquidityIndex,

    quoteTokenAddress: poolInfo.quoteTokenAddress,
    quoteTokenDecimals: poolInfo.quoteTokenDecimals,

    accountId: undefined,
    accountMargin: 0,

    ownerAddress: await signer.getAddress(),

    baseAmount: scale(poolInfo.quoteTokenDecimals)(baseAmount),

    margin: scale(poolInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(poolInfo.quoteTokenDecimals)(1),
    isETH: poolInfo.isETH,
  };

  console.log('swap params:', params);

  return params;
};
