import axios from 'axios';
import { LeafInfo, RootEntity } from '../types';
import { getLeavesIpfsUri } from './helpers';

export async function getLeavesAndRootFromIpfs(): Promise<{
  leaves: Array<LeafInfo>;
  root: RootEntity;
}> {
  const data = await axios.get(getLeavesIpfsUri(IPFS_LEAVES_CID), {
    headers: {
      Accept: 'text/plain',
    },
  });

  const snaphots: Array<{
    owner: string;
    accountPassId: number;
    metadataURI: string;
  }> = data.data.snapshot;

  const root: RootEntity = data.data.root;

  const subgraphSnapshots: Array<LeafInfo> = snaphots.map((entry) => {
    return {
      account: entry.owner,
      accountPassId: entry.accountPassId,
    };
  });

  return {
    leaves: subgraphSnapshots,
    root,
  };
}
