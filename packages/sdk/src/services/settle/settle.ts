import { BigNumber, ContractReceipt, Signer } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeSettlement } from './encode';
import { getSettlePeripheryParams } from './getSettlePeripheryParams';
import {
  getNativeGasToken,
  convertGasUnitsToNativeTokenUnits,
} from '@voltz-protocol/sdk-v1-stateless';
import { SettleArgs, SettleParameters, SettleSimulationResults } from './types';

export async function settle({
  positionId,
  signer,
}: SettleArgs): Promise<ContractReceipt> {
  // fetch: send request to api
  const partialOrder = await getSettlePeripheryParams(positionId);

  const chainId = await signer.getChainId();

  const order: SettleParameters = {
    ...partialOrder,
    owner: signer,
  };

  const { calldata: data, value } = encodeSettlement(order);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function getInfoPostSettle({
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
  const partialOrder = await getSettlePeripheryParams(positionId);

  const chainId = await signer.getChainId();

  const order: SettleParameters = {
    ...partialOrder,
    owner: signer,
  };

  const { calldata: data, value } = encodeSettlement(order);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}
