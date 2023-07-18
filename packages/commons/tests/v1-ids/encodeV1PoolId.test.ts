import { encodeV1PoolId } from '../../src';

describe('v1 Pool ID Encoder', () => {
  it('correct ID', () => {
    const poolId = encodeV1PoolId({
      chainId: 42161,
      vammAddress: '0x22393f23f16925d282aeca0a8464dccaf10ee480',
    });

    expect(poolId).toBe('42161_0x22393f23f16925d282aeca0a8464dccaf10ee480_v1');
  });
});
