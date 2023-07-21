import { Contract, Signer, providers } from 'ethers';
import { getAddress } from './addresses';

export const getDatedIrsInstrumentContract = (
  chainId: number,
  subject: providers.JsonRpcProvider | Signer,
): Contract => {
  const abi = [
    `event MarketConfigured((uint128 marketId, address quoteToken) config, uint256 blockTimestamp)`,
    `event ProductConfigured((uint128 productId, address coreProxy, address poolAddress) config, uint256 blockTimestamp)`,
    `event ProductConfigured((uint128 productId, address coreProxy, address poolAddress, uint256 takerPositionsPerAccountLimit) config, uint256 blockTimestamp)`,
    `event TakerOrder(uint128 indexed accountId, uint128 productId, uint128 indexed marketId, uint32 indexed maturityTimestamp, address collateralType, int256 executedBaseAmount, int256 executedQuoteAmount, int256 annualizedNotionalAmount, uint256 blockTimestamp)`,
    `event DatedIRSPositionSettled(uint128 indexed accountId, uint128 productId, uint128 indexed marketId, uint32 indexed maturityTimestamp, address collateralType, int256 settlementCashflowInQuote, uint256 blockTimestamp)`,
    `event RateOracleConfigured(uint128 indexed marketId, address indexed oracleAddress, uint256 blockTimestamp)`,
    `event RateOracleConfigured(uint128 indexed marketId, address indexed oracleAddress, uint256 blockTimestamp, uint256 maturityIndexCachingWindowInSeconds)`,
    `event ProductPositionUpdated(uint128 indexed accountId, uint128 indexed marketId, uint32 indexed maturityTimestamp, int256 baseDelta, int256 quoteDelta, uint256 blockTimestamp)`,
    `event RateOracleCacheUpdated(uint128 indexed marketId, address oracleAddress, uint32 timestamp, uint256 rate, uint256 blockTimestamp)`,
  ];

  const address = getAddress(chainId, 'dated_irs_instrument');

  const contract = new Contract(address, abi, subject);

  return contract;
};
