import { Signer } from "ethers";

export type SwapValidateArgs = {
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  underlyingTokenAddress: string;
};
