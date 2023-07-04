import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTxExpectError,
  Transaction,
} from '../executeTransaction';
import { CompleteLpDetails, InfoPostLp, LpArgs } from './types';
import { encodeLp } from './encode';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { decodeLp } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import {
  fixedRateToSpacedTick,
  getLiquidityFromBase,
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
  descale,
  scale,
} from '@voltz-protocol/commons-v2';
import { ZERO_BN } from '../../utils/constants';

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
      maxLeverage: 0,
    };
  }

  const { fee, im } = isError
    ? { im: decodeImFromError(bytesOutput).marginRequirement, fee: ZERO_BN }
    : decodeLp(margin < 0 ? bytesOutput[2] : bytesOutput[3]);

  const price = await convertGasUnitsToNativeTokenUnits(
    signer,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  const marginRequirement = descale(params.quoteTokenDecimals)(im);
  const maxLeverage =
    marginRequirement === 0
      ? Number.MAX_SAFE_INTEGER
      : notional / marginRequirement;

  const result = {
    gasFee,
    fee: descale(params.quoteTokenDecimals)(fee),
    marginRequirement,
    maxMarginWithdrawable: 0,
    maxLeverage,
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

  const tickLower = fixedRateToSpacedTick(fixedHigh / 100, lpInfo.tickSpacing);
  const tickUpper = fixedRateToSpacedTick(fixedLow / 100, lpInfo.tickSpacing);

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
