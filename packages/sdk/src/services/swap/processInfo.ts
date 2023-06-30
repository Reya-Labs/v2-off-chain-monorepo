import {
  convertGasUnitsToNativeTokenUnits,
  descale,
  getNativeGasToken,
} from '@voltz-protocol/commons-v2';
import { Signer, BigNumber } from 'ethers';
import { CompleteSwapDetails, InfoPostSwap } from './types';
import { Transaction } from '../executeTransaction';

export async function processInfoPostSwap(
  signer: Signer,
  executedBaseAmount: BigNumber,
  executedQuoteAmount: BigNumber,
  feeAmount: BigNumber,
  im: BigNumber,
  currentTick: number,
  txData: Transaction & {
    gasLimit: BigNumber;
  },
  params: CompleteSwapDetails,
  positionMargin = 0,
): Promise<InfoPostSwap> {
  const provider = signer.provider;
  if (!provider) {
    throw new Error(`Missing provider for ${params.ownerAddress}`);
  }

  const price = await convertGasUnitsToNativeTokenUnits(
    provider,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  const baseDelta = descale(params.quoteTokenDecimals)(executedBaseAmount);
  const quoteDelta = descale(params.quoteTokenDecimals)(executedQuoteAmount);

  const marginRequirement = 0; // todo: add
  const maxMarginWithdrawable = Math.max(0, positionMargin - marginRequirement);
  const availableNotional = 0; // todo: add
  const fee = descale(params.quoteTokenDecimals)(feeAmount);
  const slippage = 0; // todo: add
  const averageFixedRate = 0; // todo: add

  return {
    marginRequirement,
    maxMarginWithdrawable,
    availableNotional,
    fee,
    slippage,
    averageFixedRate,
    quoteDelta,
    baseDelta,
    gasFee,
  };
}
