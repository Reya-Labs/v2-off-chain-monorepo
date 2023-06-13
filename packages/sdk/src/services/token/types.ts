import { Signer } from 'ethers';

export type ApprovePeripheryArgs = {
  ammId: string;
  signer: Signer;
};

export type GetAllowanceArgs = {
  ammId: string;
  signer: Signer;
};

export type GetBalanceArgs = {
  ammId: string;
  signer: Signer;
};
