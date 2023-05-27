// Imports required for test setup
import { SwapArgs } from "../../../src/actions/types/actionArgTypes";
import { swap } from "../../../src/actions/swap/swap";
import { Signer, getDefaultProvider, BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { SwapResponse } from "../../../src/actions/actionResponseTypes";
import { getPeripheryContract } from "../../../src/common/contract-generators/getPeripheryContract";

jest.mock('../../../src/common/contract-generators/getPeripheryContract', () => ({
  getPeripheryContract: jest.fn(() => {}),
}));

describe('Swap', () => {

  it("should handle swap successfully", async () => {

    // mock periphery contract's connection to a given signer

    (getPeripheryContract as jest.Mock).mockReturnValueOnce({
      connect: jest.fn(() => {
        console.log("Connecting to periphery contract");
        return {
          swap: jest.fn(() => {return Promise.resolve({} as ContractTransaction);})
        }
      }),
      estimateGas: {
        swap: jest.fn(() => {return Promise.resolve(BigNumber.from(10000));}),
      },
    });

    const fakeSinger = {} as Signer;

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
      provider: getDefaultProvider(),
      signer: fakeSinger,
      isEth:false
    }

    const swapResult: ContractReceipt = await swap(
      mockSwapArgs
    );
  })

});