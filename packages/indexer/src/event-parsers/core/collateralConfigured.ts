import { Event, BigNumber, ethers } from 'ethers';

import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '@voltz-protocol/commons-v2';
import {
  getTokenDetails,
  CollateralConfiguredEvent,
  ProtocolEventType,
} from '@voltz-protocol/commons-v2';

export const parseCollateralConfigured = (
  chainId: number,
  event: Event,
): CollateralConfiguredEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'collateral-configured';

  // 2. Parse particular args
  const depositingEnabled = event.args?.depositingEnabled as boolean;
  const tokenAddress = event.args?.tokenAddress as string;
  const { tokenDescaler, tokenDecimals } = getTokenDetails(tokenAddress);
  const liquidationBooster = tokenDescaler(
    event.args?.liquidationBooster as BigNumber,
  );
  const cap = ethers.utils.formatUnits(
    (event.args?.cap as BigNumber).toString(),
    tokenDecimals,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    depositingEnabled,
    liquidationBooster,
    tokenAddress: convertLowercaseString(tokenAddress),
    cap,
  };
};
