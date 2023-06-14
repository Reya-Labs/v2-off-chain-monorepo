import axios from 'axios';
import { LeafInfo, RootEntity } from '../types';
import { IPFS_LEAVES_CID } from './configuration';
import { getLeavesIpfsUri } from './helpers';

export async function getLeavesAndRootFromIpfs(ownerAddress: string): Promise<{
  leaves: Array<LeafInfo>;
  root: RootEntity;
  numberOfAccessPasses: number;
}> {
  const data = await axios.get(getLeavesIpfsUri(IPFS_LEAVES_CID), {
    headers: {
      Accept: 'text/plain',
    },
  });

  const snaphots: Array<{
    owner: string;
    badgesCount: number;
  }> = data.data.snapshot;

  const root: RootEntity = data.data.root;

  let numberOfAccessPasses = 0;
  const subgraphSnapshots: Array<LeafInfo> = snaphots.map((entry) => {
    if (entry.owner.toLowerCase() === ownerAddress.toLowerCase()) {
      numberOfAccessPasses = entry.badgesCount;
    }
    return {
      account: entry.owner.toLowerCase(),
      numberOfAccessPasses: entry.badgesCount,
    };
  });

  return {
    leaves: subgraphSnapshots,
    root,
    numberOfAccessPasses,
  };
}
