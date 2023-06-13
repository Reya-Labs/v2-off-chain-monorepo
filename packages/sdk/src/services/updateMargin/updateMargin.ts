import { BigNumber, ContractReceipt } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeUpdateMargin } from './encode';
import { UpdateMarginArgs, UpdateMarginParams } from './types';
import { getUpdateMarginPeripheryParams } from './getUpdateMarginPeripheryParams';
import { getTokenDetails, scale } from '@voltz-protocol/commons-v2';

export async function updateMargin({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<ContractReceipt> {
  const partialOrder = await getUpdateMarginPeripheryParams(positionId);

  const chainId = await signer.getChainId();
  const tokenDecimals = getTokenDetails(
    partialOrder.quoteTokenAddress,
  ).tokenDecimals;

  const order: UpdateMarginParams = {
    ...partialOrder,
    margin: scale(tokenDecimals)(margin),
    owner: signer,
  };

  const { calldata: data, value } = encodeUpdateMargin(order);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function estimateUpdateMarginGasUnits({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<BigNumber> {
  const partialOrder = await getUpdateMarginPeripheryParams(positionId);

  const chainId = await signer.getChainId();
  const tokenDecimals = getTokenDetails(
    partialOrder.quoteTokenAddress,
  ).tokenDecimals;

  const order: UpdateMarginParams = {
    ...partialOrder,
    margin: scale(tokenDecimals)(margin),
    owner: signer,
  };

  const { calldata: data, value } = encodeUpdateMargin(order);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}
