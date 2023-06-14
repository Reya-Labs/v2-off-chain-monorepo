import axios from 'axios';
import { LeafInfo, RootEntity } from '../types';
import { IPFS_LEAVES_CID } from './configuration';
import { getLeavesIpfsUri } from './helpers';

export async function getIpfsData(): Promise<{
  leaves: Array<{
    owner: string;
    badgesCount: number;
  }>;
  root: string;
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

  const root: string = data.data.root;

  return { leaves: snaphots, root };
}

export async function getLeavesAndRootFromIpfs(ownerAddress: string): Promise<{
  leaves: Array<LeafInfo>;
  root: string;
  numberOfAccessPasses: number;
}> {
  const { leaves, root } = await getIpfsData();

  let numberOfAccessPasses = 0;
  const subgraphSnapshots: Array<LeafInfo> = leaves.map((entry) => {
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
