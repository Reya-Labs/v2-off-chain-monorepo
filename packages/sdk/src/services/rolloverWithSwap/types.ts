import { Signer } from 'ethers';

export type RolloverAndSwapArgs = {
  maturedPositionId: string;
  ammId: string;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  signer: Signer;
};
