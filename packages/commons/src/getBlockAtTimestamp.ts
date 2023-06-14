import { SupportedChainId, getProvider } from './provider';

export async function getBlockAtTimestamp(
  chainId: SupportedChainId,
  timestamp: number,
) {
  const provider = getProvider(chainId);

  let lo = 0;
  let hi = (await provider.getBlock('latest')).number;
  let answer = 0;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midBlock = await provider.getBlock(mid);

    if (midBlock.timestamp >= timestamp) {
      answer = midBlock.number;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return answer;
}
