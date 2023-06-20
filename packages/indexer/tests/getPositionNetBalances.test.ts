import { SECONDS_IN_YEAR } from '@voltz-protocol/commons-v2';
import { getPositionNetBalances } from '../src/event-handlers/utils/getPositionNetBalances';

// Tests
describe('getPositionNetBalances', () => {
  it('extending exposure', async () => {
    const netBalances = getPositionNetBalances({
      tradeTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
      baseDelta: 80,
      quoteDelta: -126,
      tradeLiquidityIndex: 1.5,
      existingPosition: {
        base: 100,
        timeDependentQuote: -5.5,
        freeQuote: -110,
        notional: 110,
        lockedFixedRate: 0.05,
      },
    });

    expect(netBalances.base).toBeCloseTo(180);
    expect(netBalances.notional).toBeCloseTo(230);
    expect(netBalances.timeDependentQuote).toBeCloseTo(-17.5);
    expect(netBalances.freeQuote).toBeCloseTo(-224);
    expect(netBalances.lockedFixedRate).toBeCloseTo(0.076);
  });

  it('lowering exposure', async () => {
    const netBalances = getPositionNetBalances({
      tradeTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
      baseDelta: -80,
      quoteDelta: 126,
      tradeLiquidityIndex: 1.5,
      existingPosition: {
        base: 100,
        timeDependentQuote: -5.5,
        freeQuote: -110,
        notional: 110,
        lockedFixedRate: 0.05,
      },
    });

    expect(netBalances.base).toBeCloseTo(20);
    expect(netBalances.notional).toBeCloseTo(-10);
    expect(netBalances.timeDependentQuote).toBeCloseTo(-11);
    expect(netBalances.freeQuote).toBeCloseTo(21.5);
    expect(netBalances.lockedFixedRate).toBeCloseTo(0.05);
  });

  it('going in the other direction', async () => {
    const netBalances = getPositionNetBalances({
      tradeTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
      baseDelta: -160,
      quoteDelta: 252,
      tradeLiquidityIndex: 1.5,
      existingPosition: {
        base: 100,
        timeDependentQuote: -5.5,
        freeQuote: -110,
        notional: 110,
        lockedFixedRate: 0.05,
      },
    });

    expect(netBalances.base).toBeCloseTo(-60);
    expect(netBalances.notional).toBeCloseTo(-130);
    expect(netBalances.timeDependentQuote).toBeCloseTo(48);
    expect(netBalances.freeQuote).toBeCloseTo(88.5);
    expect(netBalances.lockedFixedRate).toBeCloseTo(0.1);
  });
});
