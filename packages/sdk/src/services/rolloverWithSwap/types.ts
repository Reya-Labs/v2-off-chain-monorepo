import { Signer } from 'ethers';

export type RolloverWithSwapArgs = {
  maturedPositionId: string;
  ammId: string;
  notional: number;
  margin: number;
  signer: Signer;
};
