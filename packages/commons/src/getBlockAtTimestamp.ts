import { providers } from 'ethers';
import { exponentialBackoff } from './retry';

export async function getBlockAtTimestamp(
  provider: providers.JsonRpcProvider,
  timestamp: number,
) {
  let lo = 0;
  let hi = (await exponentialBackoff(() => provider.getBlock('latest'))).number;
  let answer = 0;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midBlock = await exponentialBackoff(() => provider.getBlock(mid));

    if (midBlock.timestamp >= timestamp) {
      answer = midBlock.number;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return answer;
}
