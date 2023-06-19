import { ethers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId, getProvider } from '../provider';

export const getDatedIrsInstrumentContract = (
  chainId: SupportedChainId,
): ethers.Contract => {
  const abi = [
    `event MarketConfigured((uint128 marketId, address quoteToken) config, uint256 blockTimestamp)`,
    `event ProductConfigured((uint128 productId, address coreProxy, address poolAddress) config, uint256 blockTimestamp)`,
    `event TakerOrder(uint128 indexed accountId, uint128 productId, uint128 indexed marketId, uint32 indexed maturityTimestamp, address collateralType, int256 executedBaseAmount, int256 executedQuoteAmount, int256 annualizedNotionalAmount, uint256 blockTimestamp)`,
    `event DatedIRSPositionSettled(uint128 indexed accountId, uint128 productId, uint128 indexed marketId, uint32 indexed maturityTimestamp, address collateralType, int256 settlementCashflowInQuote, uint256 blockTimestamp)`,
    `event RateOracleConfigured(uint128 indexed marketId, address indexed oracleAddress, uint256 blockTimestamp)`,
    `event ProductPositionUpdated(uint128 indexed accountId, uint128 indexed marketId, uint32 indexed maturityTimestamp, int256 baseDelta, int256 quoteDelta, uint256 blockTimestamp)`,
    `event RateOracleCacheUpdated(uint128 indexed marketId, address oracleAddress, uint32 timestamp, uint256 rate, uint256 blockTimestamp)`,
  ];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'dated_irs_instrument');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
