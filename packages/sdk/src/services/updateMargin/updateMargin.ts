import { BigNumber, ContractReceipt } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeUpdateMargin } from './encode';
import { UpdateMarginArgs, UpdateMarginParams } from './types';
import { scale } from '@voltz-protocol/commons-v2';
import { getPositionInfo } from '../../gateway/getPositionInfo';

export async function updateMargin({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<ContractReceipt> {
  const partialOrder = await getPositionInfo(positionId);

  const chainId = await signer.getChainId();

  const order: UpdateMarginParams = {
    ...partialOrder,
    positionMargin: scale(partialOrder.quoteTokenDecimals)(
      partialOrder.positionMargin,
    ),
    margin: scale(partialOrder.quoteTokenDecimals)(margin),
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
  const partialOrder = await getPositionInfo(positionId);

  const chainId = await signer.getChainId();

  const order: UpdateMarginParams = {
    ...partialOrder,
    positionMargin: scale(partialOrder.quoteTokenDecimals)(
      partialOrder.positionMargin,
    ),
    margin: scale(partialOrder.quoteTokenDecimals)(margin),
    owner: signer,
  };

  const { calldata: data, value } = encodeUpdateMargin(order);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}
