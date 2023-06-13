import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { BigNumber, ethers } from 'ethers';
import { LeafInfo } from '../types';

const getLeaf = (address: string, accountPassId: number): Buffer => {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(['address', 'uint96'], [address, accountPassId])
      .slice(2),
    'hex',
  );
};

const getMerkleTree = (leaves: Array<LeafInfo>): MerkleTree => {
  const leafNodes = leaves.map((entry) => {
    return getLeaf(entry.account, entry.accountPassId);
  });

  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  return merkleTree;
};

export const getProof = (
  address: string,
  accountPassId: number,
  leaves: Array<LeafInfo>,
): string[] => {
  const merkleTree = getMerkleTree(leaves);

  const proof = merkleTree.getHexProof(getLeaf(address, accountPassId));

  if (proof.length === 0) {
    throw new Error(
      `Cannot prove something that is not in tree: { address: ${address}, accountPassId: ${accountPassId}}`,
    );
  }

  return proof;
};

export const getTokenId = (
  account: string,
  merkleRoot: string,
  accountPassId: number,
): BigNumber => {
  return BigNumber.from(
    ethers.utils.solidityKeccak256(
      ['address', 'bytes32', 'uint96'],
      [account, merkleRoot, accountPassId],
    ),
  );
};
