// Imports required for test setup
import { SwapArgs } from "../../../src/actions/types/actionArgTypes";
import { ethers, getDefaultProvider, VoidSigner } from "ethers";
import { swap } from "../../../src/actions/swap/swap";
import { SwapResponse } from "../../../src/actions/actionResponseTypes";

// Mocks for the dependencies
// todo: the resolved value of the swap function mock of the periphery should change to a more realistic value
jest.mock('../../common/contract-generators/getPeripheryContract', () => ({
  getPeripheryContract: jest.fn(() => ({
    connect: jest.fn().mockReturnThis(),
    swap: jest.fn().mockResolvedValue('Swap successful'),
  })),
}));

jest.mock('ethers', () => {
  getDefaultProvider: jest.fn(() => ({}));
  VoidSigner: jest.fn(() => ({}));
})

// todo: we can just mock the getDefaultProvider() function for the mockSwapArgs using jest
// todo: same goes for the signer

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