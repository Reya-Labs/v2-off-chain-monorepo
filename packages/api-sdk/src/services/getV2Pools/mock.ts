import { ZERO_ADDRESS } from '@voltz-protocol/commons-v2';
import { V2Pool } from '../../types';

export const mockedPools: V2Pool[] = [
  {
    id: '1_1_1698710400_v2',

    chainId: 1,

    tickSpacing: 60,
    termStartTimestampInMS: 1693440000000,
    termEndTimestampInMS: 1698710400000,

    isBorrowing: false,
    market: 'Aave V3',

    rateOracle: {
      address: ZERO_ADDRESS,
      protocolId: 1,
    },

    underlyingToken: {
      address: ZERO_ADDRESS,
      name: 'usdc',
      tokenDecimals: 6,
      priceUSD: 1,
    },

    isV2: true,

    flags: {
      isGLP28Jun2023: false,
      isBlacklisted: false,
      isPaused: false,
      isSettlementAllowedWhenPaused: false,
      isArbAaveAugust: false,
    },

    marketId: '1',

    makerFee: 0.003,
    takerFee: 0.01,

    currentFixedRate: 5,
    currentPayFixedRate: 12,
    fixedRateChange: 0.5,

    currentLiquidityIndex: 1.5,
    currentVariableRate: 3.5,
    variableRateChange: 0.25,
    rateChangeLookbackWindowMS: 86400000,

    coreAddress: ZERO_ADDRESS,
    productAddress: ZERO_ADDRESS,
    exchangeAddress: ZERO_ADDRESS,
  },

  {
    id: '42161_2_1703980800_v2',

    chainId: 42161,

    tickSpacing: 60,
    termStartTimestampInMS: 1693440000000,
    termEndTimestampInMS: 1703980800000,

    isBorrowing: false,
    market: 'GMX:GLP',

    rateOracle: {
      address: ZERO_ADDRESS,
      protocolId: 8,
    },

    underlyingToken: {
      address: ZERO_ADDRESS,
      name: 'eth',
      tokenDecimals: 18,
      priceUSD: 2000,
    },

    isV2: true,

    flags: {
      isGLP28Jun2023: false,
      isBlacklisted: false,
      isPaused: false,
      isSettlementAllowedWhenPaused: false,
      isArbAaveAugust: false,
    },

    marketId: '2',

    makerFee: 0.003,
    takerFee: 0.01,

    currentFixedRate: 22,
    currentPayFixedRate: 19,
    fixedRateChange: -1,

    currentLiquidityIndex: 1.75,
    currentVariableRate: 24,
    variableRateChange: -2,
    rateChangeLookbackWindowMS: 86400000,

    coreAddress: ZERO_ADDRESS,
    productAddress: ZERO_ADDRESS,
    exchangeAddress: ZERO_ADDRESS,
  },
];
