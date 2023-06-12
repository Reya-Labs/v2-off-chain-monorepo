import { ethers } from 'ethers';

export const generateMarginEngineContract = (
  address: string,
  provider: ethers.providers.Provider,
): ethers.Contract => {
  const abi = [
    `
      function getPosition(address _owner,int24 _tickLower,int24 _tickUpper) external returns (
        bool isSettled,
        uint128 _liquidity,
        int256 margin,
        int256 fixedTokenGrowthInsideLastX128,
        int256 variableTokenGrowthInsideLastX128, 
        int256 fixedTokenBalance, 
        int256 variableTokenBalance, 
        uint256 feeGrowthInsideLastX128, 
        uint256 rewardPerAmount, 
        uint256 accumulatedFees
      )
    `,

    `function rateOracle() external view returns (address)`,

    ` 
      function getPositionMarginRequirement(
        address _recipient,
        int24 _tickLower,
        int24 _tickUpper,
        bool _isLM
      ) external returns (uint256)
    `,

    `event PositionMarginUpdate(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, int256 marginDelta)`,
  ];

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
