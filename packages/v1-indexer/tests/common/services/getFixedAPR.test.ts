import { getCurrentTick } from '../../../src/common/contract-services/getCurrentTick';
import { tickToFixedRate } from '../../../src/common/services/tickConversions';

describe.skip('get fixed APR', () => {
  it('fixed APR of stETH', async () => {
    const currentTick = await getCurrentTick(
      1,
      '0xb7edbed9c7ec58fb781a972091d94846a25097e9',
    );
    const fixedApr = tickToFixedRate(currentTick);

    expect(fixedApr).toBeCloseTo(0.050461171703695476);
  });
});
