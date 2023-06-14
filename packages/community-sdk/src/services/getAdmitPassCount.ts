import { getIpfsData } from '../utils/getIpfsLeavesAndRoot';

export async function getAdmitPassCount(ownerAddress: string): Promise<number> {
  const leaves = (await getIpfsData()).leaves;

  const ownerEntry = leaves.find(
    (entry) => entry.owner.toLowerCase() === ownerAddress.toLowerCase(),
  );

  return ownerEntry?.badgesCount ?? 0;
}
