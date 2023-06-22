import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTxExpectError,
  Transaction,
} from '../executeTransaction';
import {
  getNativeGasToken,
  convertGasUnitsToNativeTokenUnits,
} from '@voltz-protocol/sdk-v1-stateless';
import { notionalToLiquidityBN, scale, descale } from '../../utils/helpers';
import {
  CompleteLpDetails,
  InfoPostLp,
  LpArgs,
  LpPeripheryParameters,
} from './types';
import { encodeLp } from './encode';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { decodeLp } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { DEFAULT_FEE } from '../../utils/errors/constants';

export async function lp({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createLpParams({
    ammId,
    signer,
    notional,
    margin,
    fixedLow,
    fixedHigh,
  });

  const { data, value, chainId } = await getLpTxData(params);
  const result = await executeTransaction(signer, data, value, chainId);
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
  // fetch: send request to api

  const params = await createLpParams({
    ammId,
    signer,
    notional,
    margin,
    fixedLow,
    fixedHigh,
  });

  const { data, value, chainId } = await getLpTxData(params);

  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  let isError = false;
  try {
    const res = await simulateTxExpectError(signer, data, value, chainId);
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

  const provider = params.owner.provider;
  if (!provider) {
    throw new Error(`Missing provider for ${await params.owner.getAddress()}`);
  }
  const price = await convertGasUnitsToNativeTokenUnits(
    provider,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: await getNativeGasToken(provider),
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

  const { data, value, chainId } = await getLpTxData(params);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}

// HELPERS

export async function createLpParams({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<CompleteLpDetails> {
  const lpInfo = await getPoolInfo(ammId);

  const liquidityAmount = notionalToLiquidityBN(
    scale(lpInfo.quoteTokenDecimals)(notional),
    fixedLow,
    fixedHigh,
  );

  const params: CompleteLpDetails = {
    ...lpInfo,
    owner: signer,
    liquidityAmount: liquidityAmount,
    margin: scale(lpInfo.quoteTokenDecimals)(margin),
    fixedLow,
    fixedHigh,
  };

  return params;
}

export async function getLpTxData(params: CompleteLpDetails): Promise<{
  data: string;
  value: string;
  chainId: number;
}> {
  const chainId = await params.owner.getChainId();

  if (params.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const peripheryParams: LpPeripheryParameters = params;

  const { calldata: data, value } = await encodeLp(peripheryParams);

  return {
    data,
    value,
    chainId,
  };
}
