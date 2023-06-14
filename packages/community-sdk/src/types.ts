import { Signer, Bytes } from 'ethers';

export type LeafInfo = {
  account: string;
  numberOfAccessPasses: number;
};

export type BadgeRecord = {
  badgeType: string;
};

export type MultiRedeemArgs = {
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
