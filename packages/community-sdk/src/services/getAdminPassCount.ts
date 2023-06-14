import axios from 'axios';
import { getLeavesIpfsUri } from '../utils/helpers';

export async function getAdmitPassCount(ownerAddress: string): Promise<number> {
  const data = await axios.get(getLeavesIpfsUri(IPFS_LEAVES_CID), {
    headers: {
      Accept: 'text/plain',
    },
  });

  const snaphots: Array<{
    owner: string;
    numberOfAccessPasses: number;
    metadataURI: string;
  }> = data.data.snapshot;

  const ownerEntry = snaphots.find((entry) => entry.owner === ownerAddress);

  return ownerEntry?.numberOfAccessPasses ?? 0;
}
