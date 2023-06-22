import { simulateSwap } from '../swap';
import { RolloverWithSwapArgs } from '../types';
import { InfoPostSwap } from '../swap/getInfoPostSwap';

export const simulateRolloverWithSwap = async ({
  maturedPositionId,
  ammId,
  notional,
  margin,
  signer,
}: RolloverWithSwapArgs): Promise<InfoPostSwap> => {
  // todo: replcae with infopostrolloverwithswap based impl
  return simulateSwap({
    ammId,
    notional,
    margin,
    signer,
  });
};
