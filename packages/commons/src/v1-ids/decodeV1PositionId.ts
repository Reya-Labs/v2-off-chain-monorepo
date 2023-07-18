import { convertToAddress } from '../address';
import { assert } from '../assert';
import { V1PositionIdData } from './types';

export const decodeV1PositionId = (positionId: string): V1PositionIdData => {
  const parts = positionId.split('_');

  assert(parts.length === 6, `Invalid v1 position ID: ${positionId}`);

  const chainId = Number(parts[0]);
  const vammAddress = convertToAddress(parts[1]);
  const ownerAddress = convertToAddress(parts[2]);
  const tickLower = Number(parts[3]);
  const tickUpper = Number(parts[4]);
  const tag = parts[5].toLowerCase();

  assert(
    !isNaN(chainId) && !isNaN(tickLower) && !isNaN(tickUpper) && tag === 'v1',
    `Invalid v1 position ID: ${positionId}`,
  );

  return {
    chainId,
    vammAddress,
    ownerAddress,
    tickLower,
    tickUpper,
  };
};
