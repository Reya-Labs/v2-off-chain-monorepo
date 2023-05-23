import { ethers, Signer } from "ethers";

export const getPeripheryContract =  (
  peripheryAddress: string,
  provider: ethers.providers.Provider
): ethers.Contract => {

  // reference periphery interface example
  /*
     https://github.com/Voltz-Protocol/voltz-core/blob/main/contracts/interfaces/IPeriphery.sol#L89
     struct SwapPeripheryParams {
        IMarginEngine marginEngine;
        bool isFT;
        uint256 notional;
        uint160 sqrtPriceLimitX96;
        int24 tickLower;
        int24 tickUpper;
        int256 marginDelta;
    }

    function swap(SwapPeripheryParams memory params)
        external
        payable
        returns (
            int256 _fixedTokenDelta,
            int256 _variableTokenDelta,
            uint256 _cumulativeFeeIncurred,
            int256 _fixedTokenDeltaUnbalanced,
            int256 _marginRequirement,
            int24 _tickAfter,
            int256 marginDelta
        );
   */

  // todo: needs to be tested separately
  const abi: string[] = [
    `
    function swap(address, bool, uint256, uint160, int24, int24, int256) external payable returns (int256,int256,uint256,int256,int256,int24,int256)
    `
  ];

  const contract: ethers.Contract = new ethers.Contract(peripheryAddress, abi, provider);

  return contract;

}