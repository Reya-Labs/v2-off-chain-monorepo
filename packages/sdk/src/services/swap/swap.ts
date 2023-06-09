import { BigNumber, ContractReceipt } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeSwap } from './encode';
import {
  getNativeGasToken,
  convertGasUnitsToNativeTokenUnits,
} from '@voltz-protocol/sdk-v1-stateless';
import { SwapArgs, SwapParameters, SwapSimulationResults } from './types';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { getTokenDetails, scale } from '@voltz-protocol/commons-v2';
import { notionalToBaseAmount } from '../../utils/helpers';
import { ZERO_BN } from '../../utils/constants';
import { fixedRateToPrice } from '../../utils/math/tickHelpers';

async function createSwapOrder({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  fixedRateLimit,
}: SwapArgs): Promise<SwapParameters> {
  const swapInfo = await getSwapPeripheryParams(poolId);

  const tokenDecimals = getTokenDetails(
    swapInfo.quoteTokenAddress,
  ).tokenDecimals;
  const baseAmount = scale(tokenDecimals)(
    notionalToBaseAmount(notionalAmount, swapInfo.currentLiqudityIndex),
  );

  let priceLimit = ZERO_BN;
  if (fixedRateLimit) {
    priceLimit = BigNumber.from(fixedRateToPrice(fixedRateLimit));
  }

  const order: SwapParameters = {
    ...swapInfo,
    owner: signer,
    baseAmount: baseAmount,
    marginAmount: scale(tokenDecimals)(marginAmount),
    priceLimit: priceLimit,
  };

  return order;
}

export async function swap({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  fixedRateLimit,
}: SwapArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const order = await createSwapOrder({
    poolId,
    signer,
    notionalAmount,
    marginAmount,
    fixedRateLimit,
  });

  const { calldata: data, value } = await encodeSwap(order);
  const chainId = await signer.getChainId();
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function getInfoPostSwap({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  fixedRateLimit,
}: SwapArgs): Promise<SwapSimulationResults> {
  // fetch: send request to api
  const response = await estimateSwapGasUnits({
    poolId,
    signer,
    notionalAmount,
    marginAmount,
    fixedRateLimit,
  });

  const provider = signer.provider;
  if (!provider) {
    throw new Error(`Missing provider for ${await signer.getAddress()}`);
  }

  const price = await convertGasUnitsToNativeTokenUnits(
    provider,
    response.toNumber(),
  );

  return {
    gasFee: {
      value: price,
      token: await getNativeGasToken(signer.provider),
    },
  };
}

export async function estimateSwapGasUnits({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  fixedRateLimit,
}: SwapArgs): Promise<BigNumber> {
  const chainId = await signer.getChainId();

  const order = await createSwapOrder({
    poolId,
    signer,
    notionalAmount,
    marginAmount,
    fixedRateLimit,
  });

  const { calldata: data, value } = await encodeSwap(order);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}
