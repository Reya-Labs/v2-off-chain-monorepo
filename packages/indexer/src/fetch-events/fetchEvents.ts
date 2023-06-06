import { getCoreContract } from '../contract-generators/core';
import { getDatedIrsInstrumentContract } from '../contract-generators/dated-irs-instrument';
import { getDatedIrsVammContract } from '../contract-generators/dated-irs-vamm';
import { parseCollateralUpdate } from '../event-parsers/core/collateralUpdate';
import { parseMarketFeeConfigured } from '../event-parsers/core/marketFeeConfigured';
import { parseMarketConfigured } from '../event-parsers/dated-irs-instrument/marketConfigured';
import { parseProductPositionUpdated } from '../event-parsers/dated-irs-instrument/productPositionUpdated';
import { parseRateOracleConfigured } from '../event-parsers/dated-irs-instrument/rateOracleConfigured';
import { parseVammCreated } from '../event-parsers/dated-irs-vamm/vammCreated';
import { parseVammPriceChange } from '../event-parsers/dated-irs-vamm/vammPriceChange';
import { ProtocolEvent, ProtocolEventType } from '@voltz-protocol/commons-v2';

export const fetchEvents = async (
  chainId: number,
  eventTypes: ProtocolEventType[],
  fromBlock: number,
  toBlock: number,
): Promise<ProtocolEvent[]> => {
  const allEvents: ProtocolEvent[] = [];
  const coreContract = getCoreContract(chainId);
  const datedIrsInstrumentContract = getDatedIrsInstrumentContract(chainId);
  const datedIrsExchangeContract = getDatedIrsVammContract(chainId);

  if (eventTypes.includes('collateral-update')) {
    const eventFilter = coreContract.filters.CollateralUpdate();

    await coreContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseCollateralUpdate(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  if (eventTypes.includes('market-fee-configured')) {
    const eventFilter = coreContract.filters.MarketFeeConfigured();

    await coreContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseMarketFeeConfigured(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  if (eventTypes.includes('market-configured')) {
    const eventFilter = datedIrsInstrumentContract.filters.MarketConfigured();

    await datedIrsInstrumentContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseMarketConfigured(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  if (eventTypes.includes('rate-oracle-configured')) {
    const eventFilter =
      datedIrsInstrumentContract.filters.RateOracleConfigured();

    await datedIrsInstrumentContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseRateOracleConfigured(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  if (eventTypes.includes('product-position-updated')) {
    const eventFilter =
      datedIrsInstrumentContract.filters.ProductPositionUpdated();

    await datedIrsInstrumentContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseProductPositionUpdated(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  if (eventTypes.includes('vamm-created')) {
    const eventFilter = datedIrsExchangeContract.filters.VammCreated();

    await datedIrsExchangeContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) => evmEvents.map((e) => parseVammCreated(chainId, e)))
      .then((events) => {
        allEvents.push(...events);
      });
  }

  if (eventTypes.includes('vamm-price-change')) {
    const eventFilter = datedIrsExchangeContract.filters.VammPriceChange();

    await datedIrsExchangeContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseVammPriceChange(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  const sortedEvents = allEvents.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      return a.transactionIndex - b.transactionIndex;
    }

    return a.blockNumber - b.blockNumber;
  });

  return sortedEvents;
};
