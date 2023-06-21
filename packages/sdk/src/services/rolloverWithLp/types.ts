import { Signer } from 'ethers';

export type RolloverWithLpArgs = {
  maturedPositionId: string;
  ammId: string;
  fixedLow: number;
  fixedHigh: number;
  notional: number;
  margin: number;
  signer: Signer;
};
