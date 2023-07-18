import { encodeV2PositionId } from '../../src';

describe('v2 Position ID Encoder', () => {
  it('correct trader ID', () => {
    const positionId = encodeV2PositionId({
      chainId: 421613,
      marketId: '1',
      maturityTimestamp: 1690200000,
      accountId: '126306212142388365329839528979357487448',
      type: 'trader',
    });

    expect(positionId).toBe(
      '421613_126306212142388365329839528979357487448_1_1690200000_trader_v2',
    );
  });

  it('correct lp ID', () => {
    const positionId = encodeV2PositionId({
      chainId: 421613,
      marketId: '1',
      maturityTimestamp: 1690200000,
      accountId: '126306212142388365329839528979357487448',
      type: 'lp',
      tickLower: -13920,
      tickUpper: 0,
    });

    expect(positionId).toBe(
      '421613_126306212142388365329839528979357487448_1_1690200000_lp_-13920_0_v2',
    );
  });

  it('incorrect lp ID - missing ticks', () => {
    expect(() =>
      encodeV2PositionId({
        chainId: 421613,
        marketId: '1',
        maturityTimestamp: 1690200000,
        accountId: '126306212142388365329839528979357487448',
        type: 'lp',
      }),
    ).toThrowError();
  });

  it('incorrect lp ID - upper tick missing', () => {
    expect(() =>
      encodeV2PositionId({
        chainId: 421613,
        marketId: '1',
        maturityTimestamp: 1690200000,
        accountId: '126306212142388365329839528979357487448',
        type: 'lp',
        tickLower: 0,
      }),
    ).toThrowError();
  });

  it('incorrect lp ID - lower tick missing', () => {
    expect(() =>
      encodeV2PositionId({
        chainId: 421613,
        marketId: '1',
        maturityTimestamp: 1690200000,
        accountId: '126306212142388365329839528979357487448',
        type: 'lp',
        tickUpper: 0,
      }),
    ).toThrowError();
  });
});
