import { providers } from 'ethers';

export type GetPoolLpInfoResults = {
  maxLeverage: number;
};

export type GetPoolLpInfoArgs = {
  ammId: string;
  fixedHigh: number;
  fixedLow: number;
  provider: providers.Provider;
};
