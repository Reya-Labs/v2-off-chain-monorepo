import { encodeV2PoolId } from '../../src';

describe('v2 Pool ID Encoder', () => {
  it('correct ID', () => {
    const poolId = encodeV2PoolId({
      chainId: 421613,
      marketId: '1',
      maturityTimestamp: 1687867200,
    });

    expect(poolId).toBe('421613_1_1687867200_v2');
  });
});
