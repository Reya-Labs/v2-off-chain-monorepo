import { defaultAbiCoder } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { ZERO_BN } from './constants';

export function decodeSwap(bytesData: any): {
  executedBaseAmount: BigNumber;
  executedQuoteAmount: BigNumber;
  fee: BigNumber;
  marginRequirement: BigNumber;
} {
  const result = defaultAbiCoder.decode(
    ['int256', 'int256', 'uint256', 'uint256', 'int24'],
    bytesData,
  );

  // todo: to be updated when periphery is upgraded
  const im = BigNumber.from(result[3]);
  const highestUnrealizedLoss = ZERO_BN;

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

  // todo: to be updated when periphery is upgraded
  const result = defaultAbiCoder.decode(
    ['uint256', 'uint256'],
    outputOfInterest,
  );

  const im = BigNumber.from(result[1]);
  const highestUnrealizedLoss = ZERO_BN;

  const marginRequirement = im.add(highestUnrealizedLoss);

  return {
    fee: result[0],
    marginRequirement,
  };
}
