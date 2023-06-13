import { LeafInfo, MultiRedeemArgs, MultiRedeemData } from '../types';
import { getLeavesAndRootFromIpfs } from '../utils/getIpfsLeavesAndRoot';
import { getProof } from '../utils/merkle-tree';
import { ethers } from 'ethers';
import { getAccessPassContract } from '../utils/getAccessPassContract';

export async function redeemMultiple({
  badges,
  owner,
}: MultiRedeemArgs): Promise<{
  claimedBadgeTypes: number[];
}> {
  // wallet was not connected when the object was initialised
  // therefore, it couldn't obtain the contract connection
  if (!owner.provider) {
    throw new Error('Wallet not connected');
  }

  const ownerAddress = await owner.getAddress();

  // parse through badges and create
  // multiRedeem(LeafInfo[] memory leafInfos, bytes32[][] calldata proofs, bytes32[] memory merkleRoots)
  const data: MultiRedeemData = {
    leaves: [],
    proofs: [],
    roots: [],
  };

  const claimedBadgeTypes: number[] = [];
  for (const badge of badges) {
    // create merkle tree from subgraph derived leaves and get the root
    const { root, leaves } = await getLeavesAndRootFromIpfs();

    if (!root) {
      continue;
    }
    const leafInfo: LeafInfo = {
      account: ownerAddress,
      accountPassId: 1,
    };

    const proof = getProof(ownerAddress, parseInt(badge.badgeType), leaves);

    data.leaves.push(leafInfo);
    data.proofs.push(proof);
    data.roots.push(root.merkleRoot);
    claimedBadgeTypes.push(parseInt(badge.badgeType));
  }

  try {
    const accessPassContract: ethers.Contract = getAccessPassContract(
      ACCCESS_PASS_CONTRACT_ADDRESS,
      owner,
    );
    await accessPassContract.callStatic.multiRedeem(
      data.leaves,
      data.proofs,
      data.roots,
    );
    const tx = await accessPassContract.multiRedeem(
      data.leaves,
      data.proofs,
      data.roots,
    );
    await tx.wait();
    return {
      claimedBadgeTypes,
    };
  } catch (error) {
    console.warn('Unable to claim multiple badges');
    throw new Error('Unable to claim multiple badges');
  }
}
