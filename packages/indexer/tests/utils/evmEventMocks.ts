import { BigNumber, Event } from 'ethers';

export const collateralUpdateEvmEvent = {
  address: '0xe9A6569995F3D8EC971F1D314e0e832C38a735Cc',
  blockNumber: 17178234,
  blockHash: 'Block-Hash',
  transactionIndex: 21,
  transactionHash:
    '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
  logIndex: 123,
  args: {
    blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
    accountId: BigNumber.from('1000000000'),
    collateralType: '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eB48',
    tokenAmount: BigNumber.from(100000000),
  },
} as unknown as Event;

export const takerOrderEvmEvent = {
  address: '0xe9A6569995F3D8EC971F1D314e0e832C38a735Cc',
  blockNumber: 17178234,
  blockHash: 'Block-Hash',
  transactionIndex: 21,
  transactionHash:
    '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
  logIndex: 124,
  args: {
    blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
    accountId: BigNumber.from('1000000000'),
    marketId: BigNumber.from('1111111111'),
    maturityTimestamp: 1685534400, // May 31 2023 12:00:00 GMT+0000
    executedBaseAmount: BigNumber.from(100000000),
    executedQuoteAmount: BigNumber.from(-550000000),
    annualizedBaseAmount: BigNumber.from(7500000),
  },
} as unknown as Event;
