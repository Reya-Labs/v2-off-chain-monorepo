import { parseTakerOrder } from '../../src/event-parsers/dated-irs-vamm/takerOrder';
import { createTakerOrdersTable } from '../../src/services/big-table/taker-orders-table/createTakerOrdersTable';
import { deleteTakerOrdersTable } from '../../src/services/big-table/taker-orders-table/deleteTakerOrdersTable';
import { pullAllTakerOrderRows } from '../../src/services/big-table/taker-orders-table/pullAllTakerOrderRows';
import { pullTakerOrderRow } from '../../src/services/big-table/taker-orders-table/pullTakerOrderRow';
import { pushTakerOrders } from '../../src/services/big-table/taker-orders-table/pushTakerOrders';
import { compareEvents } from '../utils/compareEvents';
import { takerOrderEvmEvent } from '../utils/evmEventMocks';

jest.setTimeout(100_000);

const cleanUp = async () => {
  // Clean test topic and subscription
  try {
    await deleteTakerOrdersTable();
  } catch (_) {
    console.log(`Failed to clean up table.`);
  }
};

const test = async () => {
  const chainId = 1;
  const takerOrderEvent = parseTakerOrder(chainId, takerOrderEvmEvent);

  // 1. Create table
  await createTakerOrdersTable();

  // 2. Push some mock taker orders
  await pushTakerOrders([takerOrderEvent]);

  // 3. Pull one specific row and check the response
  {
    const event = await pullTakerOrderRow(takerOrderEvent.id);

    const comparison = compareEvents(event, takerOrderEvent);
    expect(comparison).toBe(null);
  }

  // 4. Pull all rows and check the response
  {
    const allEvents = await pullAllTakerOrderRows();
    expect(allEvents.length).toBe(1);

    const comparison = compareEvents(allEvents[0], takerOrderEvent);
    expect(comparison).toBe(null);
  }
};

describe.skip('BigTable integration test', () => {
  afterAll(cleanUp);

  it('simple flow', test);
});
