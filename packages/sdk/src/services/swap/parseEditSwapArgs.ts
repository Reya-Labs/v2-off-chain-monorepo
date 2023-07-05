import { scale } from '@voltz-protocol/commons-v2';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { EditSwapArgs, CompleteSwapDetails } from './types';

export const parseEditSwapArgs = async ({
  positionId,
  signer,
  notional,
  margin,
}: EditSwapArgs): Promise<CompleteSwapDetails> => {
  const chainId = await signer.getChainId();
  const positionInfo = await getPositionInfo(positionId);

  // Check that signer is connected to the right network
  if (positionInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Get base amount
  const baseAmount = notional / positionInfo.currentLiquidityIndex;

  // Build parameters
  const params: CompleteSwapDetails = {
    chainId,
    signer,

    productAddress: positionInfo.productAddress,
    marketId: positionInfo.marketId,
    maturityTimestamp: positionInfo.maturityTimestamp,
    currentLiquidityIndex: positionInfo.currentLiquidityIndex,

    quoteTokenAddress: positionInfo.quoteTokenAddress,
    quoteTokenDecimals: positionInfo.quoteTokenDecimals,

    accountId: positionInfo.accountId,
    accountMargin: positionInfo.positionMargin,

    ownerAddress: await signer.getAddress(),

    baseAmount: scale(positionInfo.quoteTokenDecimals)(baseAmount),

    margin: scale(positionInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(positionInfo.quoteTokenDecimals)(0),
    isETH: positionInfo.isETH,
  };

  console.log('edit swap params:', params);

  return params;
};
