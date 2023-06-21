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
import { descale, scale, notionalToLiquidityBN } from '../../utils/helpers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import {
  CompleteEditLpDetails,
  EditLpArgs,
  EditLpPeripheryParameters,
} from './types';
import { InfoPostLp } from '../lp';
import { encodeLp } from '../lp/encode';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { PositionInfo } from '../../gateway/types';
import { decodeLp } from '../../utils/decodeOutput';

export async function editLp({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createEditLpParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { data, value, chainId } = await getLpTxData(params);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function simulateEditLp({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<InfoPostLp> {
  // fetch: send request to api

  const params = await createEditLpParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { data, value, chainId } = await getLpTxData(params);
  const { txData, bytesOutput } = await simulateTx(
    signer,
    data,
    value,
    chainId,
  );

  const { fee, im } = decodeLp(
    bytesOutput,
    false,
    margin > 0,
    margin < 0,
    notional > 0,
  );

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
    maxMarginWithdrawable:
      params.positionMargin - descale(params.quoteTokenDecimals)(im),
  };

  return result;
}

export async function estimateEditLpGasUnits({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<BigNumber> {
  const params = await createEditLpParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { data, value, chainId } = await getLpTxData(params);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}

// HELPERS

async function createEditLpParams({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<CompleteEditLpDetails> {
  const lpInfo: PositionInfo = await getPositionInfo(
    positionId,
    await signer.getChainId(),
    await signer.getAddress(),
  );

  const liquidityAmount = notionalToLiquidityBN(
    scale(lpInfo.quoteTokenDecimals)(notional),
    lpInfo.fixedRateLower,
    lpInfo.fixedRateUpper,
  );

  const params: CompleteEditLpDetails = {
    ...lpInfo,
    owner: signer,
    liquidityAmount: liquidityAmount,
    margin: scale(lpInfo.quoteTokenDecimals)(margin),
    fixedLow: lpInfo.fixedRateLower,
    fixedHigh: lpInfo.fixedRateUpper,
  };

  return params;
}

async function getLpTxData(params: CompleteEditLpDetails): Promise<{
  data: string;
  value: string;
  chainId: number;
}> {
  const chainId = await params.owner.getChainId();

  if (params.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const swapPeripheryParams: EditLpPeripheryParameters = params;

  const { calldata: data, value } = await encodeLp(
    swapPeripheryParams,
    params.accountId,
  );

  return {
    data,
    value,
    chainId,
  };
}
