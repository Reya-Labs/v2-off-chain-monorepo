import { BigNumber, Signer } from 'ethers';
import { PERIPHERY_ADDRESS } from '../utils/constants';
import {
  MakerTrade,
  SettleTradeMaker,
  SettleTradeTaker,
  TakerTrade,
} from '../utils/types';
import { getGasBuffer } from '../utils/txHelpers';
import {
  encodeMakerOrder,
  encodeSettlementMakers,
  encodeSettlementTakers,
  encodeTakerOrder,
} from './encode';

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

export async function settleMaker(trade: SettleTradeMaker, chainId: number) {
  const { calldata: data, value } = encodeSettlementMakers(trade);
  await executeTransaction(trade.owner, data, value, chainId);
}

export async function settleTaker(trade: SettleTradeTaker, chainId: number) {
  const { calldata: data, value } = encodeSettlementTakers(trade);
  await executeTransaction(trade.owner, data, value, chainId);
}

export async function executeTransaction(
  signer: Signer,
  data: string,
  value: string,
  chainId: number,
) {
  const accountAddress = await signer.getAddress();

  const tx = {
    from: accountAddress,
    to: PERIPHERY_ADDRESS(chainId),
    data,
    ...(value && value !== '0'
      ? { value: BigNumber.from(value).toHexString() }
      : {}),
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

  try {
    await signer.sendTransaction({ ...tx, gasLimit });
  } catch (error) {
    // sentry error & thorw
    console.warn(error);
    //getReadableErrorMessage(error);
  }
}
