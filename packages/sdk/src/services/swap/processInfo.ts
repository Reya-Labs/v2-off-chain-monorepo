import {
  convertGasUnitsToNativeTokenUnits,
  descale,
  getNativeGasToken,
  getTimestampInSeconds,
  getAvgFixV2,
} from '@voltz-protocol/commons-v2';
import { Signer, BigNumber, providers } from 'ethers';
import { CompleteSwapDetails, InfoPostSwap } from './types';
import { Transaction } from '../executeTransaction';

export async function processInfoPostSwap(
  subject: Signer | providers.Provider,
  executedBaseAmount: BigNumber,
  executedQuoteAmount: BigNumber,
  feeAmount: BigNumber,
  im: BigNumber,
  txData: Transaction & {
    gasLimit: BigNumber;
  },
  params: CompleteSwapDetails,
  positionMargin = 0,
): Promise<InfoPostSwap> {
  const price = await convertGasUnitsToNativeTokenUnits(
    subject,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  const baseDelta = descale(params.quoteTokenDecimals)(executedBaseAmount);
  const quoteDelta = descale(params.quoteTokenDecimals)(executedQuoteAmount);

  const averageFixedRate = getAvgFixV2({
    base: baseDelta,
    quote: quoteDelta,
    liquidityIndex: params.currentLiquidityIndex,
    entryTimestamp: getTimestampInSeconds(),
    maturityTimestamp: params.maturityTimestamp,
  });

  const marginRequirement = descale(params.quoteTokenDecimals)(im);
  const maxMarginWithdrawable = Math.max(0, positionMargin - marginRequirement);
  const fee = descale(params.quoteTokenDecimals)(feeAmount);

  return {
    marginRequirement,
    maxMarginWithdrawable,
    variableTokenDeltaBalance: baseDelta,
    fee,
    averageFixedRate,
    gasFee,
  };
}
