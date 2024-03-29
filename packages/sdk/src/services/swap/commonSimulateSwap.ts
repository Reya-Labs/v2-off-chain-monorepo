import { BigNumber } from 'ethers';
import { decodeSwap } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { simulateTxExpectError, Transaction } from '../executeTransaction';
import { CompleteSwapDetails, InfoPostSwap } from './types';
import { encodeSwap } from './encode';
import {
  convertGasUnitsToNativeTokenUnits,
  descale,
  getAvgFixV2,
  getNativeGasToken,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getTradeInformation } from '@voltz-protocol/api-sdk-v2';

const defaultResponse: InfoPostSwap = {
  marginRequirement: -1,
  maxMarginWithdrawable: -1,
  fee: -1,
  averageFixedRate: -1,
  variableTokenDeltaBalance: 0,
  gasFee: {
    value: -1,
    token: 'ETH',
  },
};

export async function commonSimulateSwap(
  params: CompleteSwapDetails,
): Promise<InfoPostSwap> {
  const { calldata: data, value, swapActionPosition } = encodeSwap(params);

  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  let isError = false;

  try {
    const res = await simulateTxExpectError(
      params.signer,
      data,
      value,
      params.chainId,
    );

    txData = res.txData;
    bytesOutput = res.bytesOutput;
    isError = res.isError;
  } catch (e) {
    return defaultResponse;
  }

  let baseDelta = 0;
  let averageFixedRate = 0;
  let marginRequirement = 0;

  if (isError) {
    marginRequirement = descale(params.quoteTokenDecimals)(
      decodeImFromError(bytesOutput).marginRequirement,
    );

    const { availableBase, avgFix } = await getTradeInformation({
      poolId: params.poolId,
      base: params.inputBase,
    });

    baseDelta = availableBase;
    averageFixedRate = avgFix;
  } else {
    const output = decodeSwap(bytesOutput[swapActionPosition]);

    baseDelta = descale(params.quoteTokenDecimals)(output.executedBaseAmount);
    const quoteDelta = descale(params.quoteTokenDecimals)(
      output.executedQuoteAmount,
    );
    marginRequirement = descale(params.quoteTokenDecimals)(
      output.marginRequirement,
    );

    averageFixedRate = getAvgFixV2({
      base: baseDelta,
      quote: quoteDelta,
      liquidityIndex: params.currentLiquidityIndex,
      entryTimestamp: getTimestampInSeconds(),
      maturityTimestamp: params.maturityTimestamp,
    });
  }

  const price = await convertGasUnitsToNativeTokenUnits(
    params.signer,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  return {
    marginRequirement: Math.max(0, marginRequirement - params.accountMargin),
    maxMarginWithdrawable: Math.max(
      0,
      params.accountMargin - marginRequirement,
    ),
    variableTokenDeltaBalance: baseDelta * params.currentLiquidityIndex,
    fee: descale(params.quoteTokenDecimals)(params.fee),
    // todo: to be standardized (currently v1-sdk passes this as percentage, this is why we pass here as well)
    averageFixedRate: averageFixedRate * 100,
    gasFee,
  };
}
