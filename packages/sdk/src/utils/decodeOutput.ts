import { defaultAbiCoder } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export function decodeSwap(bytesData: any): {
  executedBaseAmount: BigNumber;
  executedQuoteAmount: BigNumber;
  fee: BigNumber;
  marginRequirement: BigNumber;
} {
  const result = defaultAbiCoder.decode(
    ['int256', 'int256', 'uint256', 'uint256', 'uint256', 'int24'],
    bytesData,
  );

  const im = BigNumber.from(result[3]);
  const highestUnrealizedLoss = BigNumber.from(result[4]);

  const marginRequirement = im.add(highestUnrealizedLoss);

  return {
    executedBaseAmount: result[0],
    executedQuoteAmount: result[1],
    fee: result[2],
    marginRequirement,
  };
}

export function decodeLp(bytesData: any): {
  fee: BigNumber;
  marginRequirement: BigNumber;
} {
  const outputOfInterest = bytesData;

  const result = defaultAbiCoder.decode(
    ['uint256', 'uint256', 'uint256'],
    outputOfInterest,
  );

  const im = BigNumber.from(result[1]);
  const highestUnrealizedLoss = BigNumber.from(result[2]);

  const marginRequirement = im.add(highestUnrealizedLoss);

  return {
    fee: result[0],
    marginRequirement,
  };
}
