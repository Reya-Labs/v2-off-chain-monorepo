import { getLeavesAndRootFromIpfs } from '../utils/getIpfsLeavesAndRoot';
import { getProof } from '../utils/merkle-tree';
import { ethers, Signer } from 'ethers';
import { getAccessPassContract } from '../utils/getAccessPassContract';
import { ACCCESS_PASS_CONTRACT_ADDRESS } from '../utils/configuration';

export async function claimAdmitPass(owner: Signer): Promise<boolean> {
  // wallet was not connected when the object was initialised
  // therefore, it couldn't obtain the contract connection
  if (!owner.provider) {
    throw new Error('Wallet not connected');
  }

  const chainId = await owner.getChainId();
  if (chainId !== 42161) {
    throw new Error('Minting only available on Arbitrum');
  }

  const ownerAddress = await owner.getAddress();

  const { root, leaves, numberOfAccessPasses } = await getLeavesAndRootFromIpfs(
    ownerAddress,
  );

  const proof = getProof(ownerAddress, numberOfAccessPasses, leaves);

  try {
    const accessPassContract: ethers.Contract = getAccessPassContract(
      ACCCESS_PASS_CONTRACT_ADDRESS,
      owner,
    );
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
