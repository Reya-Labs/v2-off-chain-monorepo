import { Event, BigNumber } from 'ethers';

import { EventType, TakerOrderEvent } from '../../utils/types';
import { wrapEventWithId } from '../../utils/wrapEventWithId';
import { descale, getTokenDetails } from '../../utils/token';

export const parseTakerOrder = (
  chainId: number,
  event: Event,
): TakerOrderEvent => {
  const type: EventType = 'taker-order';
  const blockTimestamp = event.args?.blockTimestamp as number;

  const accountId = event.args?.accountId as string;

  const marketId = event.args?.marketId as string;
  const maturityTimestamp = (
    event.args?.maturityTimestamp as BigNumber
  ).toNumber();

  // note: token information might be available in the market rows
  const quoteToken = event.args?.quoteToken as string;

  const { tokenDecimals: quoteTokenDecimals } = getTokenDetails(quoteToken);
  const tokenDescaler = descale(quoteTokenDecimals);

  const executedBaseAmount = tokenDescaler(
    event.args?.executedBaseAmount as BigNumber,
  );
  const executedQuoteAmount = tokenDescaler(
    event.args?.executedQuoteAmount as BigNumber,
  );

  // note: optional
  const annualizedBaseAmount = tokenDescaler(
    event.args?.annualizedBaseAmount as BigNumber,
  );

  const nonIdEvent: Omit<TakerOrderEvent, 'id'> = {
    type,

    chainId,
    source: event.address.toLowerCase(),

    blockTimestamp,
    blockNumber: event.blockNumber,
    blockHash: event.blockHash.toLowerCase(),

    transactionIndex: event.transactionIndex,
    transactionHash: event.transactionHash.toLowerCase(),
    logIndex: event.logIndex,

    accountId: accountId.toLowerCase(),

    marketId: marketId.toLowerCase(),
    maturityTimestamp,
    quoteToken: quoteToken.toLowerCase(),

    executedBaseAmount,
    executedQuoteAmount,

    annualizedBaseAmount,
  };

  return wrapEventWithId(nonIdEvent);
};
