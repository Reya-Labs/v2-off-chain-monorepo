import { RolloverWithLpArgs } from '../types';
import { InfoPostLp } from '../lp/getInfoPostLp';
import { simulateLp } from '../lp';

export const simulateRolloverWithLp = async ({
  maturedPositionId,
  ammId,
  fixedLow,
  fixedHigh,
  notional,
  margin,
  signer,
}: RolloverWithLpArgs): Promise<InfoPostLp> => {
  // todo: currently uses infopostlp instead of infopostrolloverwithlp
  return simulateLp({
    ammId,
    fixedLow,
    fixedHigh,
    notional,
    margin,
    signer,
  });
};
