import { ethers } from 'ethers';

import { BigQueryPoolRow } from '../../big-query-support/types';
import { SwapEventInfo } from './types';

export const parseSwapEvent = (
  event: ethers.Event,
  amm: BigQueryPoolRow,
  chainId: number,
): SwapEventInfo => {
  const eventId = `${event.blockHash}_${event.transactionHash}_${event.logIndex}`;

  const ownerAddress = event.args?.recipient as string;
  const tickLower = event.args?.tickLower as number;
  const tickUpper = event.args?.tickUpper as number;

  const tokenDecimals = amm.tokenDecimals;

  const variableTokenDelta = Number(
    ethers.utils.formatUnits(
      event.args?.variableTokenDelta as ethers.BigNumber,
      tokenDecimals,
    ),
  );
  const fixedTokenDeltaUnbalanced = Number(
    ethers.utils.formatUnits(
      event.args?.fixedTokenDeltaUnbalanced as ethers.BigNumber,
      tokenDecimals,
    ),
  );
  const feePaidToLps = Number(
    ethers.utils.formatUnits(
      event.args?.cumulativeFeeIncurred as ethers.BigNumber,
      tokenDecimals,
    ),
  );

  return {
    ...event,
    eventId: eventId.toLowerCase(),
    type: 'swap',

    chainId: chainId,
    vammAddress: amm.vamm.toLowerCase(),
    amm,

    rateOracle: amm.rateOracle,
    underlyingToken: amm.tokenName,
    marginEngineAddress: amm.marginEngine,

    ownerAddress: ownerAddress.toLowerCase(),
    tickLower,
    tickUpper,

    variableTokenDelta,
    fixedTokenDeltaUnbalanced,
    feePaidToLps,
  };
};
