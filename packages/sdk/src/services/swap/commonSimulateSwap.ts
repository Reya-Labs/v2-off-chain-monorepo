import { BigNumber } from 'ethers';
import { decodeSwap } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { Transaction, simulateTxExpectError } from '../executeTransaction';
import { InfoPostSwap, CompleteSwapDetails } from './types';
import { encodeSwap } from './encode';
import {
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
  descale,
  getAvgFixV2,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';

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
  let fee = 0;
  let marginRequirement = 0;

  if (isError) {
    marginRequirement = descale(params.quoteTokenDecimals)(
      decodeImFromError(bytesOutput).marginRequirement,
    );
  } else {
    const output = decodeSwap(bytesOutput[swapActionPosition]);

    baseDelta = descale(params.quoteTokenDecimals)(output.executedBaseAmount);
    const quoteDelta = descale(params.quoteTokenDecimals)(
      output.executedQuoteAmount,
    );
    fee = descale(params.quoteTokenDecimals)(output.fee);
    marginRequirement = descale(params.quoteTokenDecimals)(output.im);

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

  const maxMarginWithdrawable = Math.max(
    0,
    params.accountMargin - marginRequirement,
  );

  return {
    marginRequirement,
    maxMarginWithdrawable,
    variableTokenDeltaBalance: baseDelta,
    fee,
    averageFixedRate,
    gasFee,
  };
}
