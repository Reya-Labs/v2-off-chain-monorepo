import {
  getTokenDetails,
  tickToFixedRate,
  SupportedChainId,
  getTokenPriceInUSD,
} from '@voltz-protocol/commons-v2';

import {
  pullAccountCollateral,
  pullAccountPositionEntries,
  pullAccountsByAddress,
} from '@voltz-protocol/bigquery-v2';
import { getV2Pool } from '../get-pools/getV2Pool';
import { PortfolioPositionV2 } from './types';

export const getV2PortfolioPositions = async (
  chainIds: SupportedChainId[],
  ownerAddress: string,
): Promise<PortfolioPositionV2[]> => {
  const accounts = await pullAccountsByAddress(chainIds, ownerAddress);

  const portfolio: PortfolioPositionV2[] = [];

  for (const { chainId, accountId } of accounts) {
    const accountCollaterals = await pullAccountCollateral(chainId, accountId);

    if (accountCollaterals.length === 0) {
      continue;
    }

    const { collateralType: tokenAddress, balance: margin } =
      accountCollaterals[0];

    const { tokenName } = getTokenDetails(tokenAddress);
    const tokenPriceUSD = await getTokenPriceInUSD(tokenName);

    const positionEntries = await pullAccountPositionEntries(
      chainId,
      accountId,
    );

    for (const {
      id: positionId,
      marketId,
      maturityTimestamp,
      type: positionType,
      baseBalance,
      notionalBalance,
      quoteBalance,
      paidFees,
      tickLower,
      tickUpper,
    } of positionEntries) {
      const pool = await getV2Pool(chainId, marketId, maturityTimestamp);

      if (!pool) {
        throw new Error(
          `Pool ${chainId}-${marketId}-${maturityTimestamp} was not found.`,
        );
      }

      const poolFixedRate = pool.currentFixedRate;
      const poolVariableRate = pool.currentVariableRate;

      // todo: add fixed rate locked to position
      const fixedRateLocked = 0.05;

      const fixLow = tickToFixedRate(tickUpper);
      const fixHigh = tickToFixedRate(tickLower);

      // notional balance
      const notionalProvided = 0;
      const notionalTraded = notionalBalance;
      const notional =
        positionType === 'lp' ? notionalProvided : notionalTraded;

      // health factor
      const health = 'healthy';

      // variant
      const variant = 'active';

      // PnL
      const realizedPNLFees = -paidFees;
      const realizedPNLCashflow = 0;
      const unrealizedPNL = 0;

      // Build response
      const position: PortfolioPositionV2 = {
        id: positionId,
        ownerAddress,
        type:
          positionType === 'lp' ? 'LP' : baseBalance < 0 ? 'Fixed' : 'Variable',
        creationTimestampInMS: 0, // todo: add creation timestamp to positions
        tickLower,
        tickUpper,
        fixLow,
        fixHigh,
        tokenPriceUSD,
        notionalProvided,
        notionalTraded: notionalBalance,
        notional,
        margin,
        status: {
          health,
          variant,
          currentFixed: poolFixedRate,
          receiving: baseBalance < 0 ? fixedRateLocked : poolVariableRate,
          paying: baseBalance < 0 ? poolVariableRate : fixedRateLocked,
        },
        unrealizedPNL,
        realizedPNLFees,
        realizedPNLCashflow,
        realizedPNLTotal: realizedPNLCashflow + realizedPNLFees,
        amm: pool,
      };

      portfolio.push(position);
    }
  }

  return portfolio;
};
