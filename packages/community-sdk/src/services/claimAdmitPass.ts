import { getLeavesAndRootFromIpfs } from '../utils/getIpfsLeavesAndRoot';
import { getProof } from '../utils/merkle-tree';
import { Signer } from 'ethers';
import { getAlphaPassContract } from '@voltz-protocol/commons-v2';

export async function claimAdmitPass(owner: Signer): Promise<boolean> {
  const chainId = await owner.getChainId();
  const ownerAddress = await owner.getAddress();

  const { root, leaves, numberOfAccessPasses } = await getLeavesAndRootFromIpfs(
    ownerAddress,
  );

  const proof = getProof(ownerAddress, numberOfAccessPasses, leaves);
  const accessPassContract = getAlphaPassContract(chainId, owner);

  try {
    await accessPassContract
      .connect(owner)
      .callStatic.redeem(ownerAddress, numberOfAccessPasses, proof, root);

    const tx = await accessPassContract
      .connect(owner)
      .redeem(ownerAddress, numberOfAccessPasses, proof, root);

    await tx.wait();

    return true;
  } catch (error) {
    console.warn('Unable to claim multiple badges');

    throw new Error('Unable to claim multiple badges');
  }
}
