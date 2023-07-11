import { ethers, Signer, BigNumber } from 'ethers';
import { getLeavesAndRootFromIpfs } from '../utils/getIpfsLeavesAndRoot';
import keccak256 from 'keccak256';
import { getAlphaPassContract } from '@voltz-protocol/commons-v2/dist/types';

/**
 *
 * @note checks if the user owns an admin pass on-chain
 */
export async function verifyAdmitPass(owner: Signer): Promise<boolean> {
  const ownerAddress = await owner.getAddress();
  const chainId = await owner.getChainId();

  const accessPassContract = getAlphaPassContract(chainId, owner);
  const balance: BigNumber = await accessPassContract.balanceOf(ownerAddress);

  return balance.gt(0);
}

/**
 *
 * @note checks if the token id was claimed
 */
export async function isAdmitPassClaimed(owner: Signer): Promise<boolean> {
  const ownerAddress = await owner.getAddress();
  const chainId = await owner.getChainId();

  const data = await getLeavesAndRootFromIpfs(ownerAddress);
  const tokenId = keccak256(
    ethers.utils.solidityPack(
      ['address', 'bytes32', 'uint256'],
      [ownerAddress, data.root, 0],
    ),
  );

  const accessPassContract = getAlphaPassContract(chainId, owner);

  try {
    await accessPassContract.ownerOf(BigNumber.from(tokenId));
  } catch (e) {
    return false;
  }

  return true;
}
