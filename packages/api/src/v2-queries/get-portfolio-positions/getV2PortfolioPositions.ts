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
import { V2PortfolioPosition } from './types';

export const getV2PortfolioPositions = async (
  chainIds: SupportedChainId[],
  ownerAddress: string,
): Promise<V2PortfolioPosition[]> => {
  const accounts = await pullAccountsByAddress(chainIds, ownerAddress);

  const portfolio: V2PortfolioPosition[] = [];

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
      accountId,
      marketId,
      maturityTimestamp,
      type: positionType,
      base,
      notional: notionalTraded,
      paidFees,
      tickLower,
      tickUpper,
      creationTimestamp,
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
      const position: V2PortfolioPosition = {
        id: positionId,
        accountId,
        ownerAddress,
        type:
          positionType === 'lp' ? 'LP' : notional < 0 ? 'Fixed' : 'Variable',
        creationTimestampInMS: creationTimestamp * 1000,
        tickLower,
        tickUpper,
        fixLow,
        fixHigh,
        tokenPriceUSD,
        notionalProvided,
        notionalTraded,
        notional,
        margin,
        status: {
          health,
          variant,
          currentFixed: poolFixedRate,
          receiving: notional < 0 ? fixedRateLocked : poolVariableRate,
          paying: notional < 0 ? poolVariableRate : fixedRateLocked,
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
