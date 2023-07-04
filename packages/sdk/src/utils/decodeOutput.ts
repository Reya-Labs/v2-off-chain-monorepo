import { defaultAbiCoder } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export function decodeSwap(bytesData: any): {
  executedBaseAmount: BigNumber;
  executedQuoteAmount: BigNumber;
  fee: BigNumber;
  im: BigNumber;
} {
  const result = defaultAbiCoder.decode(
    ['int256', 'int256', 'uint256', 'uint256', 'int24'],
    bytesData,
  );

  return {
    executedBaseAmount: result[0],
    executedQuoteAmount: result[1],
    fee: result[2],
    im: result[3],
  };
}

export function decodeLp(bytesData: any): {
  fee: BigNumber;
  im: BigNumber;
} {
  const outputOfInterest = bytesData;

  const result = defaultAbiCoder.decode(
    ['uint256', 'uint256'],
    outputOfInterest,
  );

  return {
    fee: result[0],
    im: result[1],
  };
}
