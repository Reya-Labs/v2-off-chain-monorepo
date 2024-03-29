import { BaseEvent } from '@voltz-protocol/bigquery-v2';
import { BigNumber, Event } from 'ethers';
import { parseAccountCreated } from '../../../../src/event-parsers/parseAccountCreated';
import { parseVammCreated } from '../../../../src/event-parsers/parseVammCreated';
import { parseLiquidityChange } from '../../../../src/event-parsers/parseLiquidityChange';
import { parseVammPriceChange } from '../../../../src/event-parsers/parseVammPriceChange';
import { parseProductPositionUpdated } from '../../../../src/event-parsers/parseProductPositionUpdated';
import { parseCollateralUpdate } from '../../../../src/event-parsers/parseCollateralUpdate';
import { parseMarketConfigured } from '../../../../src/event-parsers/parseMarketConfigured';
import { ZERO_ADDRESS } from '@voltz-protocol/commons-v2';
import { parseRateOracleConfigured } from '../../../../src/event-parsers/parseRateOracleConfigured';

export const chainId = 1;

const transactionHash = 'Transaction-Hash';
const blockHash = 'Block-Hash';

const marketId = BigNumber.from('1111111111');
const collateralType = '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eb48';
const rateOracleAddress = '0xa6ba323693f9e9b591f79fbdb947C7330ca2d7ab';

const owner = '0xF8F6B70a36f4398f0853a311dC6699Aba8333Cc1';
const accountId = BigNumber.from('1000000000');

const maturityTimestamp = 1704024000; // Sun Dec 31 2023 12:00:00 GMT+0000

// todo: enrich scenario
export const events: BaseEvent[] = [
  // An account is created
  parseAccountCreated(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 1,
    transactionIndex: 10,
    logIndex: 100,
    args: {
      blockTimestamp: BigNumber.from(1682942400), // Mon May 01 2023 12:00:00 GMT+0000
      accountId,
      owner,
    },
  } as unknown as Event),

  // One market is created
  parseMarketConfigured(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 2,
    transactionIndex: 10,
    logIndex: 100,
    args: {
      blockTimestamp: BigNumber.from(1682942400), // Mon May 01 2023 12:00:00 GMT+0000
      data: {
        marketId,
        quoteToken: collateralType,
      },
    },
  } as unknown as Event),

  // One market is created
  parseRateOracleConfigured(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 2,
    transactionIndex: 10,
    logIndex: 101,
    args: {
      blockTimestamp: BigNumber.from(1682942400), // Mon May 01 2023 12:00:00 GMT+0000
      marketId,
      oracleAddress: rateOracleAddress,
    },
  } as unknown as Event),

  // One pool is launched with starting price 1%
  parseVammCreated(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 3,
    transactionIndex: 10,
    logIndex: 100,
    args: {
      blockTimestamp: BigNumber.from(1682942400), // Mon May 01 2023 12:00:00 GMT+0000
      marketId,
      tick: 0,
      mutableConfig: {
        priceImpactPhi: BigNumber.from(0),
        priceImpactBeta: BigNumber.from(0),
        spread: BigNumber.from(0),
        rateOracle: rateOracleAddress,
      },
      config: {
        _maxLiquidityPerTick: BigNumber.from(0),
        _tickSpacing: 60,
        maturityTimestamp,
      },
    },
  } as unknown as Event),

  // Collateral is updated
  parseCollateralUpdate(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 4,
    transactionIndex: 10,
    logIndex: 100,
    args: {
      blockTimestamp: BigNumber.from(1682942400), // Mon May 01 2023 12:00:00 GMT+0000
      accountId,
      collateralType,
      tokenAmount: BigNumber.from(10000000),
    },
  } as unknown as Event),

  // Liquidity is minted between [0.5%, 2%]
  parseLiquidityChange(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 4,
    transactionIndex: 10,
    logIndex: 101,
    args: {
      blockTimestamp: BigNumber.from(1682942400), // Mon May 01 2023 12:00:00 GMT+0000
      accountId,
      marketId,
      maturityTimestamp,
      tickLower: -6960,
      tickUpper: 6960,
      liquidityDelta: BigNumber.from(1000000000),
    },
  } as unknown as Event),

  // Price has moved to 1.25%
  parseVammPriceChange(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 5,
    transactionIndex: 10,
    logIndex: 100,
    args: {
      blockTimestamp: BigNumber.from(1685620800), // Thu Jun 01 2023 12:00:00 GMT+0000
      marketId,
      maturityTimestamp,
      tick: -2220,
    },
  } as unknown as Event),

  // One trader position has been updated
  parseProductPositionUpdated(chainId, {
    address: ZERO_ADDRESS,
    blockHash,
    transactionHash,
    blockNumber: 5,
    transactionIndex: 10,
    logIndex: 101,
    args: {
      blockTimestamp: BigNumber.from(1685620800), // Thu Jun 01 2023 12:00:00 GMT+0000
      accountId,
      marketId,
      maturityTimestamp,
      baseDelta: BigNumber.from(1000000000),
      quoteDelta: BigNumber.from(1000000000),
    },
  } as unknown as Event),
];
