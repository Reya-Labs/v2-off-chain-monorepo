import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTx,
} from '../executeTransaction';
import {
  getNativeGasToken,
  convertGasUnitsToNativeTokenUnits,
} from '@voltz-protocol/sdk-v1-stateless';
import { notionalToLiquidityBN, scale, descale } from '../../utils/helpers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import {
  CompleteLpDetails,
  InfoPostLp,
  LpArgs,
  LpPeripheryParameters,
} from './types';
import { encodeLp } from './encode';
import { getPoolInfo } from '../../gateway/getPoolInfo';

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
  const { txData, bytesOutput } = await simulateTx(
    signer,
    data,
    value,
    chainId,
  );

  const { fee, im } = decodeLpOutput(bytesOutput);

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

export function decodeLpOutput(bytesData: any): {
  fee: BigNumber;
  im: BigNumber;
} {
  // (int256 executedBaseAmount, int256 executedQuoteAmount, uint256 fee, uint256 im, int24 currentTick)
  if (!bytesData[0]) {
    throw new Error('unable to decode Swap output');
  }

  const result = defaultAbiCoder.decode(['uint256', 'uint256'], bytesData[0]);

  return {
    fee: result[0],
    im: result[1],
  };
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

  const swapPeripheryParams: LpPeripheryParameters = params;

  const { calldata: data, value } = await encodeLp(swapPeripheryParams);

  return {
    data,
    value,
    chainId,
  };
}
