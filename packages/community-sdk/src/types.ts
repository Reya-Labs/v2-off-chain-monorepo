import { Signer, Bytes } from 'ethers';

export type LeafInfo = {
  account: string;
  accountPassId: number;
};

export type BadgeRecord = {
  badgeType: string;
};

export type MultiRedeemArgs = {
  badges: BadgeRecord[];
  owner: Signer;
};

export type MultiRedeemData = {
  leaves: Array<LeafInfo>;
  proofs: Array<string[]>;
  roots: Array<Bytes>;
};

export type RootEntity = {
  merkleRoot: Bytes;
  baseMetadataUri: string;
};
