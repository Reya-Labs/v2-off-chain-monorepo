import { encodeV1PositionId } from '../../src';

describe('v1 Position ID Encoder', () => {
  it('correct ID', () => {
    const positionId = encodeV1PositionId({
      chainId: 42161,
      vammAddress: '0x3ecf01157e9b1a66197325771b63789d1fb18f1f',
      ownerAddress: '0xf8f6b70a36f4398f0853a311dc6699aba8333cc1',
      tickLower: -13860,
      tickUpper: -6960,
    });

    expect(positionId).toBe(
      '42161_0x3ecf01157e9b1a66197325771b63789d1fb18f1f_0xf8f6b70a36f4398f0853a311dc6699aba8333cc1_-13860_-6960_v1',
    );
  });
});
