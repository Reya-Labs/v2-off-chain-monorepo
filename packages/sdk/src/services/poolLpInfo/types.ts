import { Signer } from 'ethers';

export type GetPoolLpInfoResults = {
  maxLeverage: number;
};

export type GetLpMaxLeverageArgs = {
  fixedLow: number;
  fixedHigh: number;
  signer: Signer;
  ammId: string;
};

export type GetPoolLpInfoArgs = {
  ammId: string;
  fixedHigh: number;
  fixedLow: number;
  signer: Signer;
};
