import { decodeV1PoolId } from '../../src';

describe('v1 Pool ID Decoder', () => {
  it('correct ID', () => {
    const { chainId, vammAddress } = decodeV1PoolId(
      '42161_0x22393f23f16925d282aeca0a8464dccaf10ee480_v1',
    );

    expect(chainId).toBe(42161);
    expect(vammAddress).toBe('0x22393f23f16925d282aeca0a8464dccaf10ee480');
  });

  it('correct ID - mixed case', () => {
    const { chainId, vammAddress } = decodeV1PoolId(
      '42161_0x22393f23f16925D282aeca0a8464dccaf10ee480_V1',
    );

    expect(chainId).toBe(42161);
    expect(vammAddress).toBe('0x22393f23f16925d282aeca0a8464dccaf10ee480');
  });

  it('incorrect ID - invalid tag', () => {
    expect(() =>
      decodeV1PoolId('42161$0x22393f23f16925D282aeca0a8464dccaf10ee480_V3'),
    ).toThrowError();
  });

  it('incorrect ID - invalid number of parts (2)', () => {
    expect(() =>
      decodeV1PoolId('42161$0x22393f23f16925D282aeca0a8464dccaf10ee480_V1'),
    ).toThrowError();
  });

  it('incorrect ID - invalid number of parts (4)', () => {
    expect(() =>
      decodeV1PoolId('42161_0x22393f23f16925D282aeca0a8464dccaf10ee480_V1_V1'),
    ).toThrowError();
  });

  it('incorrect ID - chain id NaN', () => {
    expect(() =>
      decodeV1PoolId('4216f_0x22393f23f16925D282aeca0a8464dccaf10ee480_V1'),
    ).toThrowError();
  });
});
