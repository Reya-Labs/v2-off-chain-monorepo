import { simulateSwap } from '../swap';
import { RolloverAndSwapArgs } from '../types';
import { InfoPostSwap } from '../swap/getInfoPostSwap';

export const simulateRolloverWithSwap = async ({
  maturedPositionId,
  ammId,
  notional,
  margin,
  signer,
}: RolloverAndSwapArgs): Promise<InfoPostSwap> => {
  // todo: replcae with infopostrolloverwithswap based impl
  return simulateSwap({
    ammId,
    notional,
    margin,
    signer,
  });
};
