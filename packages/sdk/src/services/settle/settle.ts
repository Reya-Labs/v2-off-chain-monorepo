import { BigNumber, ContractReceipt } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeSettlement } from './encode';
import {
  getNativeGasToken,
  convertGasUnitsToNativeTokenUnits,
} from '@voltz-protocol/sdk-v1-stateless';
import { SettleArgs, SettleParameters, SettleSimulationResults } from './types';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { scale } from '../../utils/helpers';

export async function settle({
  positionId,
  signer,
}: SettleArgs): Promise<ContractReceipt> {
  // fetch: send request to api
  const chainId = await signer.getChainId();

  const partialOrder = await getPositionInfo(positionId);

  if (partialOrder.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const order: SettleParameters = {
    ...partialOrder,
    margin: scale(partialOrder.quoteTokenDecimals)(partialOrder.positionMargin),
    owner: signer,
  };

  const { calldata: data, value } = encodeSettlement(order);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function simulateSettle({
  positionId,
  signer,
}: SettleArgs): Promise<SettleSimulationResults> {
  // fetch: send request to api
  const response = await estimateSettleGasUnits({ signer, positionId });

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

export async function estimateSettleGasUnits({
  positionId,
  signer,
}: SettleArgs): Promise<BigNumber> {
  const chainId = await signer.getChainId();

  const partialOrder = await getPositionInfo(positionId);

  if (partialOrder.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const order: SettleParameters = {
    ...partialOrder,
    margin: scale(partialOrder.quoteTokenDecimals)(partialOrder.positionMargin),
    owner: signer,
  };

  const { calldata: data, value } = encodeSettlement(order);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}
