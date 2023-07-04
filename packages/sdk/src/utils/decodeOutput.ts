import { defaultAbiCoder } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export function findOutput(
  bytesData: any,
  createAccount: boolean,
  depositedMargin: boolean,
  withdrawMargin: boolean,
  swap: boolean,
  lp: boolean,
  settle: boolean,
): any {
  if (!depositedMargin == true && withdrawMargin == true) {
    throw new Error('Cannot withdraw and deposit in the same transaction');
  }

  let outputIndex = -1;
  if (createAccount) outputIndex += 1;
  if (depositedMargin) outputIndex += 2;
  if (withdrawMargin) outputIndex += 2;
  if (swap) outputIndex += 1;
  if (lp) outputIndex += 1;
  if (settle) outputIndex += 1; // PAY command is the last one but does not output anything

  if (!bytesData[outputIndex]) {
    throw new Error('unable to decode action output');
  }

  return bytesData[outputIndex];
}

export function decodeSwap(
  bytesData: any,
  createAccount: boolean,
  withdrawMargin: boolean,
  depositedMargin: boolean,
  swap: boolean,
): {
  executedBaseAmount: BigNumber;
  executedQuoteAmount: BigNumber;
  fee: BigNumber;
  im: BigNumber;
} {
  const outputOfInterest = findOutput(
    bytesData,
    createAccount,
    depositedMargin,
    withdrawMargin,
    swap,
    false,
    false,
  );

  const result = defaultAbiCoder.decode(
    ['int256', 'int256', 'uint256', 'uint256', 'int24'],
    outputOfInterest,
  );

  return {
    executedBaseAmount: result[0],
    executedQuoteAmount: result[1],
    fee: result[2],
    im: result[3],
  };
}

export function decodeLp(
  bytesData: any,
  createAccount: boolean,
  depositedMargin: boolean,
  withdrawMargin: boolean,
  lp: boolean,
): {
  fee: BigNumber;
  im: BigNumber;
} {
  const outputOfInterest = findOutput(
    bytesData,
    createAccount,
    depositedMargin,
    withdrawMargin,
    false,
    lp,
    false,
  );

  // ( uint256 fee, uint256 im)
  const result = defaultAbiCoder.decode(
    ['uint256', 'uint256'],
    outputOfInterest,
  );

  return {
    fee: result[0],
    im: result[1],
  };
}
