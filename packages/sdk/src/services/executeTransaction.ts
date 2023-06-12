import { BigNumber, ContractReceipt, Signer } from 'ethers';
import { PERIPHERY_ADDRESS } from '../utils/configuration';
import { getGasBuffer } from '../utils/txHelpers';
import { defaultAbiCoder } from 'ethers/lib/utils';

export type Transaction = {
  from: string;
  to: string;
  data: string;
  value?: string;
};

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

  let gasLimit: BigNumber;

  try {
    const gasEstimate = await signer.estimateGas(tx);
    gasLimit = getGasBuffer(gasEstimate);
  } catch (error) {
    // sentry error & thorw
    console.warn(error);
    const errorMessage = ''; //getReadableErrorMessage(error);
    throw new Error(errorMessage);
  }

  return { ...tx, gasLimit };
}

export async function simulateTx(
  signer: Signer,
  data: string,
  value: string,
  chainId: number,
): Promise<{
  txData: Transaction & { gasLimit: BigNumber };
  bytesOutput: any;
}> {
  const txData = await estimateGas(signer, data, value, chainId);

  let bytesOutput;
  try {
    const encodedOutput = await signer.call(txData);
    if (encodedOutput === undefined) {
      throw new Error('Failed to get transaction output');
    }
    bytesOutput = defaultAbiCoder.decode(['bytes[]'], encodedOutput);
  } catch (error) {
    // sentry error & thorw
    console.warn(error);
    const errorMessage = ''; //getReadableErrorMessage(error);
    throw new Error(errorMessage);
  }

  return {
    txData: txData,
    bytesOutput: bytesOutput[0],
  };
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
