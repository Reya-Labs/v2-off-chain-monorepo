import { decodeV2PoolId } from '../../src';

describe('v2 Pool ID Decoder', () => {
  it('correct ID', () => {
    const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(
      '421613_1_1687867200_v2',
    );

    expect(chainId).toBe(421613);
    expect(marketId).toBe('1');
    expect(maturityTimestamp).toBe(1687867200);
  });

  it('correct ID - mixed case', () => {
    const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(
      '421613_1_1687867200_V2',
    );

    expect(chainId).toBe(421613);
    expect(marketId).toBe('1');
    expect(maturityTimestamp).toBe(1687867200);
  });

  it('incorrect ID - invalid tag', () => {
    expect(() => decodeV2PoolId('421613_1_1687867200_v3')).toThrowError();
  });

  it('incorrect ID - chainId NaN', () => {
    expect(() => decodeV2PoolId('42161f_1_1687867200_v2')).toThrowError();
  });

  it('incorrect ID - maturityTimestamp NaN', () => {
    expect(() => decodeV2PoolId('421613_1_168786720r_v2')).toThrowError();
  });

  it('incorrect ID - invalid number of parts (3)', () => {
    expect(() => decodeV2PoolId('421613_11687867200_v2')).toThrowError();
  });

  it('incorrect ID - invalid number of parts (5)', () => {
    expect(() => decodeV2PoolId('421613_11687867200_v2_v3')).toThrowError();
  });
});
