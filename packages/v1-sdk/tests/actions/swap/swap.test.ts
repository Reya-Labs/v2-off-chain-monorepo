// Imports required for test setup
import { SwapArgs } from "../../../src/actions/types/actionArgTypes";
import { ethers, getDefaultProvider, VoidSigner } from "ethers";
import { swap } from "../../../src/actions/swap/swap";
import { SwapResponse } from "../../../src/actions/actionResponseTypes";

jest.mock('../../../src/common/contract-generators', () => ({
  getPeripheryContract: jest.fn(() => ({
    connect: jest.fn().mockReturnThis(),
    swap: jest.fn().mockResolvedValue('Swap successful'),
  })),
}));

jest.mock('ethers', () => {
  getDefaultProvider: jest.fn(() => ({}));
});

describe('Swap', () => {

  it("should handle swap successfully", async () => {

    const mockSigner  = new ethers.VoidSigner(
      "0xChadSigner", ethers.getDefaultProvider()
    );

    const mockSwapArgs = {
      isFT:false,
      notional:100,
      margin:100,
      fixedRateLimit:0.1,
      fixedLow:0.1,
      fixedHigh:0.2,
      underlyingTokenAddress:"0xChadToken",
      underlyingTokenDecimals:18,
      tickSpacing:60,
      chainId:1,
      peripheryAddress:"0xChadPeriphery",
      marginEngineAddress:"0xChadMarginEngine",
      provider:ethers.getDefaultProvider(),
      signer:mockSigner,
      isEth:false
    }

    // Execute the swap function
    const swapResult = await swap(
      mockSwapArgs
    );

    // Assert that swap has been successful
    expect(swapResult).toBe('Swap successful');
  })

});