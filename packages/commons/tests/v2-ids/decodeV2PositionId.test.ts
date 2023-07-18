import { decodeV2PositionId } from '../../src';

describe('v2 Position ID Decoder', () => {
  it('correct trader ID', () => {
    const {
      chainId,
      marketId,
      maturityTimestamp,
      accountId,
      type,
      tickLower,
      tickUpper,
    } = decodeV2PositionId(
      '421613_126306212142388365329839528979357487448_1_1690200000_trader_v2',
    );

    expect(chainId).toBe(421613);
    expect(marketId).toBe('1');
    expect(maturityTimestamp).toBe(1690200000);
    expect(accountId).toBe('126306212142388365329839528979357487448');
    expect(type).toBe('trader');
    expect(tickLower).toBe(undefined);
    expect(tickUpper).toBe(undefined);
  });

  it('correct lp ID', () => {
    const {
      chainId,
      marketId,
      maturityTimestamp,
      accountId,
      type,
      tickLower,
      tickUpper,
    } = decodeV2PositionId(
      '421613_215454405927653009326091050534534147949_1_1690200000_lp_-13920_0_v2',
    );

    expect(chainId).toBe(421613);
    expect(marketId).toBe('1');
    expect(maturityTimestamp).toBe(1690200000);
    expect(accountId).toBe('215454405927653009326091050534534147949');
    expect(type).toBe('lp');
    expect(tickLower).toBe(-13920);
    expect(tickUpper).toBe(0);
  });

  it('correct lp ID - mixed case', () => {
    const {
      chainId,
      marketId,
      maturityTimestamp,
      accountId,
      type,
      tickLower,
      tickUpper,
    } = decodeV2PositionId(
      '421613_215454405927653009326091050534534147949_1_1690200000_lp_-13920_0_V2',
    );

    expect(chainId).toBe(421613);
    expect(marketId).toBe('1');
    expect(maturityTimestamp).toBe(1690200000);
    expect(accountId).toBe('215454405927653009326091050534534147949');
    expect(type).toBe('lp');
    expect(tickLower).toBe(-13920);
    expect(tickUpper).toBe(0);
  });

  it('incorrect ID - invalid number of parts', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_215454405927653009326091050534534147949_1_1690200000',
      ),
    ).toThrowError();
  });

  it('incorrect ID - non-existing type', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_126306212142388365329839528979357487448_1_169020000f_ft_v2',
      ),
    ).toThrowError();
  });

  it('incorrect trader ID - invalid tag', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_126306212142388365329839528979357487448_1_1690200000_trader_v3',
      ),
    ).toThrowError();
  });

  it('incorrect trader ID - chainId NaN', () => {
    expect(() =>
      decodeV2PositionId(
        '42161f_126306212142388365329839528979357487448_1_1690200000_trader_v3',
      ),
    ).toThrowError();
  });

  it('incorrect trader ID - maturityTimestamp NaN', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_126306212142388365329839528979357487448_1_169020000f_trader_v2',
      ),
    ).toThrowError();
  });

  it('incorrect trader ID - incorrect number of parts', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_126306212142388365329839528979357487448_1_1690200000_trader_v2_v3',
      ),
    ).toThrowError();
  });

  it('incorrect lp ID - invalid tag', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_215454405927653009326091050534534147949_1_1690200000_lp_-13920_0_v3',
      ),
    ).toThrowError();
  });

  it('incorrect lp ID - tickLower NaN', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_215454405927653009326091050534534147949_1_1690200000_lp_-13f20_0_v2',
      ),
    ).toThrowError();
  });

  it('incorrect lp ID - tickUpper NaN', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_215454405927653009326091050534534147949_1_1690200000_lp_-13920_12b_v2',
      ),
    ).toThrowError();
  });

  it('incorrect lp ID - incorrect number of parts', () => {
    expect(() =>
      decodeV2PositionId(
        '421613_215454405927653009326091050534534147949_1_1690200000_lp_-13920_120',
      ),
    ).toThrowError();
  });
});
