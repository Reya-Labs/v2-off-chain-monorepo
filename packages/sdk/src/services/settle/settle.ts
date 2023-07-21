import { BigNumber, ContractReceipt } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeSettlement } from './encode';
import { SettleArgs, SettleParameters, SettleSimulationResults } from './types';
import {
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
  getTimestampInSeconds,
  scale,
} from '@voltz-protocol/commons-v2';
import { getPosition } from '@voltz-protocol/api-sdk-v2';

export async function settle({
  positionId,
  signer,
}: SettleArgs): Promise<ContractReceipt> {
  const order = await createSettleParams({ positionId, signer });

  const { calldata: data, value } = encodeSettlement(order);
  const result = await executeTransaction(signer, data, value, order.chainId);
  return result;
}

export async function simulateSettle({
  positionId,
  signer,
}: SettleArgs): Promise<SettleSimulationResults> {
  const response = await estimateSettleGasUnits({ signer, positionId });
  const chainId = await signer.getChainId();

  const price = await convertGasUnitsToNativeTokenUnits(
    signer,
    response.toNumber(),
  );

  return {
    gasFee: {
      value: price,
      token: getNativeGasToken(chainId),
    },
  };
}

export async function estimateSettleGasUnits({
  positionId,
  signer,
}: SettleArgs): Promise<BigNumber> {
  const order = await createSettleParams({ positionId, signer });

  const { calldata: data, value } = encodeSettlement(order);
  const estimate = await estimateGas(signer, data, value, order.chainId);

  return estimate.gasLimit;
}

async function createSettleParams({
  positionId,
  signer,
}: SettleArgs): Promise<SettleParameters> {
  const chainId = await signer.getChainId();

  const position = await getPosition(positionId, false);

  if (position.pool.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const quoteTokenDecimals = position.pool.underlyingToken.tokenDecimals;
  const maturityTimestamp = getTimestampInSeconds(
    position.pool.termEndTimestampInMS,
  );

  const order: SettleParameters = {
    chainId: position.pool.chainId,
    owner: signer,
    productAddress: position.pool.productAddress,
    maturityTimestamp,
    marketId: position.pool.marketId,
    quoteTokenAddress: position.pool.underlyingToken.address,
    accountId: position.accountId,
    margin: scale(quoteTokenDecimals)(position.margin),
  };

  console.log('settle params:', order);

  return order;
}
