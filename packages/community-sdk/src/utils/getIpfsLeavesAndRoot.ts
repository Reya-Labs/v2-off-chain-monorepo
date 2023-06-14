import axios from 'axios';
import { LeafInfo } from '../types';
import { IPFS_LEAVES_CID } from './configuration';
import { getLeavesIpfsUri } from './helpers';
import { Bytes, ethers } from 'ethers';

export async function getIpfsData(): Promise<{
  leaves: Array<{
    owner: string;
    badgesCount: number;
  }>;
  root: Bytes;
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

  const root: Bytes = ethers.utils.arrayify(data.data.root);

  return { leaves: snaphots, root };
}

export async function getLeavesAndRootFromIpfs(ownerAddress: string): Promise<{
  leaves: Array<LeafInfo>;
  root: Bytes;
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
