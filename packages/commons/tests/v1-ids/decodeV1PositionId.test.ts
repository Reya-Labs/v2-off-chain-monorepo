import { decodeV1PositionId } from '../../src';

describe('v1 Position ID Decoder', () => {
  it('correct ID', () => {
    const { chainId, vammAddress, ownerAddress, tickLower, tickUpper } =
      decodeV1PositionId(
        '42161_0x3ecf01157e9b1a66197325771b63789d1fb18f1f_0xf8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860_-6960_v1',
      );

    expect(chainId).toBe(42161);
    expect(vammAddress).toBe('0x3ecf01157e9b1a66197325771b63789d1fb18f1f');
    expect(ownerAddress).toBe('0xf8f6b70a36f4398f0853a311dc6699aba8333cc1');
    expect(tickLower).toBe(-13860);
    expect(tickUpper).toBe(-6960);
  });

  it('correct ID - mixed case', () => {
    const { chainId, vammAddress, ownerAddress, tickLower, tickUpper } =
      decodeV1PositionId(
        '42161_0x3eCf01157e9b1a66197325771b63789d1fb18f1f_0xF8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860_-6960_V1',
      );

    expect(chainId).toBe(42161);
    expect(vammAddress).toBe('0x3ecf01157e9b1a66197325771b63789d1fb18f1f');
    expect(ownerAddress).toBe('0xf8f6b70a36f4398f0853a311dc6699aba8333cc1');
    expect(tickLower).toBe(-13860);
    expect(tickUpper).toBe(-6960);
  });

  it('incorrect ID - invalid tag', () => {
    expect(() =>
      decodeV1PositionId(
        '42161_0x3eCf01157e9b1a66197325771b63789d1fb18f1f_0xF8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860_-6960_V3',
      ),
    ).toThrowError();
  });

  it('incorrect ID - chain id NaN', () => {
    expect(() =>
      decodeV1PositionId(
        '4216f_0x3eCf01157e9b1a66197325771b63789d1fb18f1f_0xF8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860_-6960_V1',
      ),
    ).toThrowError();
  });

  it('incorrect ID - invalid number of parts (4)', () => {
    expect(() =>
      decodeV1PositionId(
        '421610x3eCf01157e9b1a66197325771b63789d1fb18f1f_0xF8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860-6960_V1',
      ),
    ).toThrowError();
  });

  it('incorrect ID - invalid number of parts (7)', () => {
    expect(() =>
      decodeV1PositionId(
        '4216f_0x3eCf01157e9b1a66197325771b63789d1fb18f1f_0xF8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860_-6960_V1_V2',
      ),
    ).toThrowError();
  });
});
