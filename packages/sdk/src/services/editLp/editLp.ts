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
import { getTokenDetails, scale, descale } from '@voltz-protocol/commons-v2';
import { notionalToLiquidityBN } from '../../utils/helpers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import {
  CompleteEditLpDetails,
  EditLpArgs,
  EditLpPeripheryParameters,
} from './types';
import { getEditLpPeripheryParams } from './getEditLpPeripheryParams';
import { InfoPostLp } from '../lp';
import { encodeLp } from '../lp/encode';

export async function editLp({
  positionId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: EditLpArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createEditLpParams({
    positionId,
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

export async function simulateEditLp({
  positionId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: EditLpArgs): Promise<InfoPostLp> {
  // fetch: send request to api

  const params = await createEditLpParams({
    positionId,
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

  const { fee, im } = decodeEditLpOutput(bytesOutput);

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

  const tokenDecimals = getTokenDetails(params.quoteTokenAddress).tokenDecimals;

  const result = {
    gasFee: gasFee,
    fee: descale(tokenDecimals)(fee),
    marginRequirement: descale(tokenDecimals)(im),
    maxMarginWithdrawable: params.positionMargin - descale(tokenDecimals)(im),
  };

  return result;
}

export async function estimateEditLpGasUnits({
  positionId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: EditLpArgs): Promise<BigNumber> {
  const params = await createEditLpParams({
    positionId,
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

async function createEditLpParams({
  positionId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: EditLpArgs): Promise<CompleteEditLpDetails> {
  const lpInfo = await getEditLpPeripheryParams(positionId);

  const tokenDecimals = getTokenDetails(lpInfo.quoteTokenAddress).tokenDecimals;
  const liquidityAmount = notionalToLiquidityBN(
    scale(tokenDecimals)(notional),
    tokenDecimals,
    fixedLow,
  );

  const params: CompleteEditLpDetails = {
    ...lpInfo,
    owner: signer,
    liquidityAmount: liquidityAmount,
    margin: scale(tokenDecimals)(margin),
    fixedLow,
    fixedHigh,
  };

  return params;
}

export function decodeEditLpOutput(bytesData: any): {
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

async function getLpTxData(params: CompleteEditLpDetails): Promise<{
  data: string;
  value: string;
  chainId: number;
}> {
  const chainId = await params.owner.getChainId();
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
