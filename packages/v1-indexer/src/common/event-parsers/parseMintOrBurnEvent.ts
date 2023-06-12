import { BigNumber, ethers } from 'ethers';

import { BigQueryPoolRow } from '../../big-query-support/types';
import { getTokensFromLiquidity } from '../services/getTokensFromLiquidity';
import { MintOrBurnEventInfo } from './types';

export const parseMintOrBurnEvent = (
  event: ethers.Event,
  amm: BigQueryPoolRow,
  chainId: number,
  isMint: boolean,
): MintOrBurnEventInfo => {
  const eventId = `${event.blockHash}_${event.transactionHash}_${event.logIndex}`;

  const ownerAddress = event.args?.owner as string;
  const tickLower = event.args?.tickLower as number;
  const tickUpper = event.args?.tickUpper as number;
  const amount = event.args?.amount as BigNumber;

  const tokenDecimals = amm.tokenDecimals;
  const liquidityDelta = Number(
    ethers.utils.formatUnits(amount, tokenDecimals),
  );
  const { absVariableTokenDelta: notionalDelta } = getTokensFromLiquidity(
    liquidityDelta,
    tickLower,
    tickUpper,
  );

  return {
    ...event,
    eventId: eventId.toLowerCase(),
    type: isMint ? 'mint' : 'burn',

    chainId: chainId,
    vammAddress: amm.vamm.toLowerCase(),
    amm,

    rateOracle: amm.rateOracle,
    underlyingToken: amm.tokenName,
    marginEngineAddress: amm.marginEngine,

    ownerAddress: ownerAddress.toLowerCase(),
    tickLower,
    tickUpper,

    notionalDelta: (isMint ? 1 : -1) * notionalDelta,
    liquidityDelta: (isMint ? 1 : -1) * liquidityDelta,
  };
};
