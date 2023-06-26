import { Contract, providers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId } from '../provider';

export const getCoreContract = (
  chainId: SupportedChainId,
  provider: providers.JsonRpcProvider,
): Contract => {
  const abi = [
    `event AccountCreated(uint128 indexed accountId, address indexed owner, uint256 blockTimestamp)`,
    `event AccountOwnerUpdate(uint128 indexed accountId, address indexed newOwner, uint256 blockTimestamp)`,
    `event PermissionGranted(uint128 indexed accountId, bytes32 indexed permission, address indexed user, address sender, uint256 blockTimestamp)`,
    `event PermissionRevoked(uint128 indexed accountId, bytes32 indexed permission, address indexed user, address sender, uint256 blockTimestamp)`,
    `event CollateralConfigured(address indexed collateralType, (bool depositingEnabled, uint256 liquidationBooster, address tokenAddress, uint256 cap) config, uint256 blockTimestamp)`,
    `event Deposited(uint128 indexed accountId, address indexed collateralType, uint256 tokenAmount, address indexed sender, uint256 blockTimestamp)`,
    `event Withdrawn(uint128 indexed accountId, address indexed collateralType, uint256 tokenAmount, address indexed sender, uint256 blockTimestamp)`,
    `event MarketFeeConfigured((uint128 productId, uint128 marketId, uint128 feeCollectorAccountId, uint256 atomicMakerFee, uint256 atomicTakerFee) config, uint256 blockTimestamp)`,
    `event Liquidation(uint128 indexed liquidatedAccountId, address indexed collateralType, address sender, uint128 liquidatorAccountId,uint256 liquidatorRewardAmount, uint256 imPreClose, uint256 imPostClose, uint256 blockTimestamp)`,
    `event ProductRegistered(address indexed product, uint128 indexed productId, string name, address indexed sender, uint256 blockTimestamp)`,
    `event AccountClosed(uint128 indexed accountId, address collateralType, address sender, uint256 blockTimestamp)`,
    `event MarketRiskConfigured((uint128 productId, uint128 marketId, int256 riskParameter, uint32 twapLookbackWindow) config, uint256 blockTimestamp)`,
    `event ProtocolRiskConfigured((uint256 imMultiplier, uint256 liquidatorRewardParameter) config, uint256 blockTimestamp)`,
    `event CollateralUpdate(uint128 indexed accountId, address indexed collateralType, int256 tokenAmount, uint256 blockTimestamp)`,
    `event LiquidatorBoosterUpdate(uint128 indexed accountId, address indexed collateralType, int256 tokenAmount, uint256 blockTimestamp)`,
  ];

  const address = getAddress(chainId, 'core');

  const contract = new Contract(address, abi, provider);

  return contract;
};
