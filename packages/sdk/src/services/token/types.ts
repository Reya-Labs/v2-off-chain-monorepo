import { Signer } from 'ethers';
import { BasePool } from '@voltz-protocol/api-sdk-v2';

export type ApprovePeripheryArgs = {
  ammId: string;
  signer: Signer;
};

export type GetAllowanceToPeripheryArgs = {
  ammId: string;
  signer: Signer;
};

export type GetTokenAllowanceForPeripheryArgs = {
  tokenName: BasePool['underlyingToken']['name'];
  signer: Signer;
};

export type GetBalanceArgs = {
  ammId: string;
  signer: Signer;
};

export type ApproveTokenPeripheryArgs = {
  tokenName: BasePool['underlyingToken']['name'];
  signer: Signer;
};
