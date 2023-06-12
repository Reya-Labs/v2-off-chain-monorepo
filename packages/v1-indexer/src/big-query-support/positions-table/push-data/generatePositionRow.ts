import {
  SECONDS_IN_YEAR,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { SwapEventInfo } from '../../../common/event-parsers/types';
import { getCashflowInfo } from '../../../common/services/getCashflowInfo';
import { BigQueryPoolRow, BigQueryPositionRow } from '../../types';

export const generatePositionRow = (
  amm: BigQueryPoolRow,
  eventInfo: SwapEventInfo,
  eventTimestamp: number,
  existingPosition: BigQueryPositionRow | null,
  liquidityIndexAtRootEvent: number,
): BigQueryPositionRow => {
  const rowLastUpdatedTimestamp = getTimestampInSeconds();

  const unbalancedFixedTokenDelta = eventInfo.fixedTokenDeltaUnbalanced;

  const incomingCashflowLiFactor =
    eventInfo.variableTokenDelta / liquidityIndexAtRootEvent;
  const incomingCashflowTimeFactor = unbalancedFixedTokenDelta * 0.01;
  const incomingCashflowFreeTerm =
    -eventInfo.variableTokenDelta -
    (unbalancedFixedTokenDelta * 0.01 * eventTimestamp) / SECONDS_IN_YEAR;

  const {
    notional: netNotionalLocked,
    cashflowLiFactor,
    cashflowTimeFactor,
    cashflowFreeTerm,
  } = getCashflowInfo(
    {
      notional: existingPosition?.netNotionalLocked || 0,
      cashflowLiFactor: existingPosition?.cashflowLiFactor || 0,
      cashflowTimeFactor: existingPosition?.cashflowTimeFactor || 0,
      cashflowFreeTerm: existingPosition?.cashflowFreeTerm || 0,
    },
    {
      notional: eventInfo.variableTokenDelta,
      cashflowLiFactor: incomingCashflowLiFactor,
      cashflowTimeFactor: incomingCashflowTimeFactor,
      cashflowFreeTerm: incomingCashflowFreeTerm,
    },
    Math.floor(amm.termEndTimestampInMS / 1000),
  );

  const netFixedRateLocked =
    netNotionalLocked === 0
      ? 0
      : Math.abs(cashflowTimeFactor / netNotionalLocked);

  // {
  //   const rPnL =
  //     liquidityIndexAtRootEvent * cashflowLiFactor +
  //     (eventTimestamp * cashflowTimeFactor) / SECONDS_IN_YEAR +
  //     cashflowFreeTerm;

  //   console.log(`current rPnL of position: ${rPnL}`);
  // }

  // todo: add empty entries
  return {
    chainId: eventInfo.chainId,
    marginEngineAddress:
      existingPosition?.marginEngineAddress || amm.marginEngine.toLowerCase(),
    vammAddress: existingPosition?.vammAddress || eventInfo.vammAddress,
    ownerAddress: existingPosition?.ownerAddress || eventInfo.ownerAddress,
    tickLower: existingPosition?.tickLower || eventInfo.tickLower,
    tickUpper: existingPosition?.tickUpper || eventInfo.tickUpper,
    realizedPnLFromSwaps: 0, // todo: deprecate
    realizedPnLFromFeesPaid:
      (existingPosition?.realizedPnLFromFeesPaid || 0) - eventInfo.feePaidToLps,
    netNotionalLocked,
    netFixedRateLocked,
    lastUpdatedBlockNumber: eventInfo.blockNumber,
    notionalLiquidityProvided: existingPosition?.notionalLiquidityProvided || 0, // todo: track
    realizedPnLFromFeesCollected:
      existingPosition?.realizedPnLFromFeesCollected || 0, // todo: track
    netMarginDeposited: existingPosition?.netMarginDeposited || 0, // todo: track
    rateOracleIndex: existingPosition?.rateOracleIndex || amm.protocolId,
    rowLastUpdatedTimestamp: rowLastUpdatedTimestamp,
    fixedTokenBalance: existingPosition?.fixedTokenBalance || 0, // todo: track
    variableTokenBalance: existingPosition?.variableTokenBalance || 0, // todo: track
    positionInitializationBlockNumber:
      existingPosition?.positionInitializationBlockNumber ||
      eventInfo.blockNumber,
    rateOracle: existingPosition?.rateOracle || amm.rateOracle,
    underlyingToken: existingPosition?.underlyingToken || amm.tokenName,
    cashflowLiFactor,
    cashflowTimeFactor,
    cashflowFreeTerm,
    liquidity: existingPosition?.liquidity || 0,
  };
};
