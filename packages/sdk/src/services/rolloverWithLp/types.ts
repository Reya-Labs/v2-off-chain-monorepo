import { Signer } from 'ethers';

export type RolloverAndLpArgs = {
  maturedPositionId: string;
  ammId: string;
  fixedLow: number;
  fixedHigh: number;
  notional: number;
  margin: number;
  signer: Signer;
};
