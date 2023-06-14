import axios from 'axios';
import { IPFS_LEAVES_CID } from '../utils/configuration';
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

  const ownerEntry = snaphots.find(
    (entry) => entry.owner.toLowerCase() === ownerAddress.toLowerCase(),
  );

  return ownerEntry?.numberOfAccessPasses ?? 0;
}
