import { ethers, Signer, BigNumber } from 'ethers';
import { getAccessPassContract } from '../utils/getAccessPassContract';
import { getLeavesAndRootFromIpfs } from '../utils/getIpfsLeavesAndRoot';
import keccak256 from 'keccak256';

/**
 *
 * @note checks if the user owns an admin pass on-chain
 */
export async function verifyAdminPass(owner: Signer): Promise<boolean> {
  const ownerAddress = await owner.getAddress();
  const accessPassContract: ethers.Contract = getAccessPassContract(
    ACCCESS_PASS_CONTRACT_ADDRESS,
    owner,
  );
  const balance: BigNumber = await accessPassContract.balanceOf(ownerAddress);

  return balance.gt(0);
}

/**
 *
 * @note checks if the token id was claimed
 */
export async function isAdmitPassClaimed(owner: Signer): Promise<boolean> {
  const ownerAddress = await owner.getAddress();

  const data = await getLeavesAndRootFromIpfs(ownerAddress);
  const tokenId = keccak256(
    ethers.utils.solidityPack(
      ['address', 'bytes32', 'uint256'],
      [ownerAddress, data.root, 0],
    ),
  );

  const accessPassContract: ethers.Contract = getAccessPassContract(
    ACCCESS_PASS_CONTRACT_ADDRESS,
    owner,
  );
  try {
    await accessPassContract.ownerOf(BigNumber.from(tokenId));
  } catch (e) {
    return false;
  }

  return true;
}
