import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTxExpectError,
  Transaction,
} from '../executeTransaction';
import { scale, descale } from '../../utils/helpers';
import { CompleteLpDetails, InfoPostLp, LpArgs } from './types';
import { encodeLp } from './encode';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { decodeLp } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { DEFAULT_FEE } from '../../utils/errors/constants';
import {
  fixedRateToSpacedTick,
  getLiquidityFromBase,
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
} from '@voltz-protocol/commons-v2';
import { TICK_SPACING } from '../../utils/math/constants';

export async function lp({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<ContractReceipt> {
  const params = await createLpParams({
    ammId,
    signer,
    notional,
    margin,
    fixedLow,
    fixedHigh,
  });

  const { calldata: data, value } = encodeLp(params);
  const result = await executeTransaction(signer, data, value, params.chainId);
  return result;
}

export async function simulateLp({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<InfoPostLp> {
  const params = await createLpParams({
    ammId,
    signer,
    notional,
    margin,
    fixedLow,
    fixedHigh,
  });

  const { calldata: data, value } = encodeLp(params);

  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  let isError = false;

  try {
    const res = await simulateTxExpectError(
      signer,
      data,
      value,
      params.chainId,
    );

    txData = res.txData;
    bytesOutput = res.bytesOutput;
    isError = res.isError;
  } catch (e) {
    return {
      gasFee: {
        value: -1,
        token: 'ETH',
      },
      fee: -1,
      marginRequirement: -1,
      maxMarginWithdrawable: -1,
    };
  }

  const { fee, im } = isError
    ? { im: decodeImFromError(bytesOutput).marginRequirement, fee: DEFAULT_FEE }
    : decodeLp(bytesOutput, true, margin > 0, false, true);

  const price = await convertGasUnitsToNativeTokenUnits(
    signer,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  const result = {
    gasFee: gasFee,
    fee: descale(params.quoteTokenDecimals)(fee),
    marginRequirement: descale(params.quoteTokenDecimals)(im),
    maxMarginWithdrawable: 0,
  };

  return result;
}

export async function estimateLpGasUnits({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<BigNumber> {
  const params = await createLpParams({
    ammId,
    signer,
    notional,
    margin,
    fixedLow,
    fixedHigh,
  });

  const { calldata: data, value } = encodeLp(params);
  const estimate = await estimateGas(signer, data, value, params.chainId);

  return estimate.gasLimit;
}

export async function getLpInfo(
  args: Omit<LpArgs, 'margin'>,
): Promise<InfoPostLp> {
  return simulateLp({
    ...args,
    margin: 0,
  });
}

async function createLpParams({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<CompleteLpDetails> {
  if (fixedLow >= fixedHigh) {
    throw new Error(`Invalid LP range: [${fixedLow}%, ${fixedHigh}%]`);
  }

  const lpInfo = await getPoolInfo(ammId);
  const chainId = await signer.getChainId();

  // Check that signer is connected to the right network
  if (lpInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  const tickLower = fixedRateToSpacedTick(fixedHigh / 100, TICK_SPACING);
  const tickUpper = fixedRateToSpacedTick(fixedLow / 100, TICK_SPACING);

  const base = notional / lpInfo.currentLiquidityIndex;
  const liquidityAmount = getLiquidityFromBase(base, tickLower, tickUpper);

  const params: CompleteLpDetails = {
    ...lpInfo,
    ownerAddress: await signer.getAddress(),
    liquidityAmount: scale(lpInfo.quoteTokenDecimals)(liquidityAmount),
    margin: scale(lpInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(lpInfo.quoteTokenDecimals)(1),
    tickLower,
    tickUpper,
  };

  console.log('lp params:', params);

  return params;
}
