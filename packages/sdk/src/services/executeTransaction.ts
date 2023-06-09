import { BigNumber, ContractReceipt, Signer } from 'ethers';
import { PERIPHERY_ADDRESS } from '../utils/configuration';
import { MakerTrade, TakerTrade } from '../utils/types';
import { getGasBuffer } from '../utils/txHelpers';
import { encodeMakerOrder, encodeTakerOrder } from './encode';

export type Transaction = {
  from: string;
  to: string;
  data: string;
  value?: string;
};

// todo: come up with a nice way of sending the owner address from the top level function

export async function swap(trade: TakerTrade, chainId: number) {
  const { calldata: data, value } = await encodeTakerOrder(trade);
  await executeTransaction(trade.owner, data, value, chainId);
}

export async function makerOrder(trade: MakerTrade, chainId: number) {
  const { calldata: data, value } = await encodeMakerOrder(trade);
  await executeTransaction(trade.owner, data, value, chainId);
}

export async function estimateGas(
  signer: Signer,
  data: string,
  value: string,
  chainId: number,
): Promise<Transaction & { gasLimit: BigNumber }> {
  const accountAddress = await signer.getAddress();

  const tx = {
    from: accountAddress,
    to: PERIPHERY_ADDRESS(chainId),
    data,
    ...(value && value !== '0' ? { value: value } : {}),
  };

  const provider = signer.provider;
  if (!provider) {
    throw new Error(`Missing provider for ${await signer.getAddress()}`);
  }

  let gasLimit: BigNumber;

  try {
    const gasEstimate = await provider.estimateGas(tx);
    await provider.call(tx);
    gasLimit = getGasBuffer(gasEstimate);
  } catch (error) {
    // sentry error & thorw
    console.warn(error);
    const errorMessage = ''; //getReadableErrorMessage(error);
    throw new Error(errorMessage);
  }

  return { ...tx, gasLimit };
}

export async function executeTransaction(
  signer: Signer,
  data: string,
  value: string,
  chainId: number,
): Promise<ContractReceipt> {
  const txData = await estimateGas(signer, data, value, chainId);
  try {
    const txResponse = await signer.sendTransaction(txData);
    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (error) {
    // sentry error & thorw
    console.warn(error);
    throw new Error('Transaction Execution Error');
    //getReadableErrorMessage(error);
  }
}
