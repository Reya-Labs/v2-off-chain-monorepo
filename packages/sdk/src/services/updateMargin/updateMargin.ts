import { BigNumber, ContractReceipt } from 'ethers';
import { estimateGas, executeTransaction } from '../executeTransaction';
import { encodeUpdateMargin } from './encode';
import { UpdateMarginArgs, UpdateMarginParams } from './types';
import { scale } from '@voltz-protocol/commons-v2';
import { getPosition } from '@voltz-protocol/api-sdk-v2';

export async function updateMargin({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<ContractReceipt> {
  const order = await createUpdateMarginParams({
    positionId,
    margin,
    signer,
  });

  const { calldata: data, value } = encodeUpdateMargin(order);
  const result = await executeTransaction(signer, data, value, order.chainId);
  return result;
}

export async function estimateUpdateMarginGasUnits({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<BigNumber> {
  const order = await createUpdateMarginParams({
    positionId,
    margin,
    signer,
  });

  const { calldata: data, value } = encodeUpdateMargin(order);
  const estimate = await estimateGas(signer, data, value, order.chainId);

  return estimate.gasLimit;
}

async function createUpdateMarginParams({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<UpdateMarginParams> {
  const chainId = await signer.getChainId();

  const partialOrder = await getPosition({ positionId, includeHistory: false });

  if (partialOrder.pool.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const quoteTokenDecimals = partialOrder.pool.underlyingToken.tokenDecimals;
  const isETH = partialOrder.pool.underlyingToken.priceUSD > 1;

  const params: UpdateMarginParams = {
    chainId,
    quoteTokenAddress: partialOrder.pool.underlyingToken.address,
    quoteTokenDecimals,
    isETH,
    accountId: partialOrder.accountId,
    margin: scale(quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(quoteTokenDecimals)(0),
  };

  console.log('update margin params:', params);

  return params;
}
