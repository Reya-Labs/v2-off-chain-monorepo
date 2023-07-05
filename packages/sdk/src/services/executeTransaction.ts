import { BigNumber, ContractReceipt, Signer, ethers } from 'ethers';
import { getGasBuffer } from '../utils/txHelpers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { estimateAnyTradeGasUnits } from '../utils/estimateSwapGasUnits';
import { getReadableErrorMessage } from '../utils/errors/errorHandling';
import { getAddress } from '@voltz-protocol/commons-v2';

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
    to: getAddress(chainId, 'periphery'),
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
    const errorMessage = getReadableErrorMessage(error);
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
    const errorMessage = getReadableErrorMessage(error);
    throw new Error(errorMessage);
  }

  return {
    txData: txData,
    bytesOutput: bytesOutput[0],
  };
}

export async function simulateTxExpectError(
  signer: Signer,
  data: string,
  value: string,
  chainId: number,
): Promise<{
  txData: Transaction & { gasLimit: BigNumber };
  bytesOutput: any;
  isError: boolean;
}> {
  const accountAddress = await signer.getAddress();

  const tx = {
    from: accountAddress,
    to: getAddress(chainId, 'periphery'),
    data,
    ...(value && value !== '0' ? { value: value } : {}),
  };

  const gasUnits = estimateAnyTradeGasUnits(chainId);

  const txData = {
    ...tx,
    gasLimit: getGasBuffer(BigNumber.from(gasUnits)),
  };

  let isError = false;
  let resultOrError: any;
  try {
    await signer
      .call(txData)
      .then((result) => {
        const abiFragment = [
          'function execute(bytes, bytes[], uint256) external returns (bytes[])',
        ];
        const abiInterface = new ethers.utils.Interface(abiFragment);
        const decodedResponse = abiInterface.decodeFunctionResult(
          'execute',
          result,
        );

        resultOrError = decodedResponse[0];
      })
      .catch((error) => {
        isError = true;
        resultOrError = error;
      });
  } catch (error) {
    const errorMessage = getReadableErrorMessage(error);
    throw new Error(errorMessage);
  }

  return {
    txData: txData,
    bytesOutput: resultOrError,
    isError: isError,
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
    console.warn(error);
    throw new Error('Transaction Execution Error');
  }
}
