import { getLeavesAndRootFromIpfs } from '../utils/getIpfsLeavesAndRoot';
import { getProof } from '../utils/merkle-tree';
import { ethers, Signer } from 'ethers';
import { getAccessPassContract } from '../utils/getAccessPassContract';

export async function claimAdmitPass(owner: Signer): Promise<{
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

  const claimedBadgeTypes: number[] = [];
  // create merkle tree from subgraph derived leaves and get the root
  const { root, leaves, numberOfAccessPasses } = await getLeavesAndRootFromIpfs(
    ownerAddress,
  );

  if (!root) {
    throw new Error('Missing root');
  }

  const proof = getProof(ownerAddress, numberOfAccessPasses, leaves);

  try {
    const accessPassContract: ethers.Contract = getAccessPassContract(
      ACCCESS_PASS_CONTRACT_ADDRESS,
      owner,
    );
    await accessPassContract.callStatic.multiRedeem(
      ownerAddress,
      numberOfAccessPasses,
      proof,
      root,
    );
    const tx = await accessPassContract.multiRedeem(
      ownerAddress,
      numberOfAccessPasses,
      proof,
      root,
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
