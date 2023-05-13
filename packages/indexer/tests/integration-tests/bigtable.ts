import { createTakerOrdersTable } from '../../src/services/big-table/taker-orders-table/createTakerOrdersTable';
import { deleteTakerOrdersTable } from '../../src/services/big-table/taker-orders-table/deleteTakerOrdersTable';
import { pullAllTakerOrderRows } from '../../src/services/big-table/taker-orders-table/pullAllTakerOrderRows';
import { pullTakerOrderRow } from '../../src/services/big-table/taker-orders-table/pullTakerOrderRow';
import { pushTakerOrders } from '../../src/services/big-table/taker-orders-table/pushTakerOrders';
import { compareEvents } from '../utils/compareEvents';
import { takerOrderEvent } from '../utils/mocks';

const cleanUp = async () => {
  // Clean test topic and subscription
  try {
    await deleteTakerOrdersTable();
  } catch (_) {
    console.log(`Failed to clean up table.`);
  }
};

const test = async () => {
  // 1. Create table
  await createTakerOrdersTable();

  // 2. Push some mock taker orders
  await pushTakerOrders([takerOrderEvent]);

  // 3. Pull one specific row and check the response
  {
    const event = await pullTakerOrderRow(takerOrderEvent.id);

    console.log(`Checking response...`);

    const comparison = compareEvents(event, takerOrderEvent);
    if (comparison) {
      throw new Error(comparison);
    }
  }

  // 4. Pull all rows and check the response
  {
    const allEvents = await pullAllTakerOrderRows();

    if (!(allEvents.length === 1)) {
      throw new Error(`Pulled events are of length ${allEvents.length}`);
    }

    const comparison = compareEvents(allEvents[0], takerOrderEvent);
    if (comparison) {
      throw new Error(comparison);
    }
  }
};

test()
  .then(() => {
    console.log(`Passed.`);
  })
  .catch((error) => {
    console.log(`Failed with message: ${(error as Error).message}`);
  })
  .finally(() => {
    cleanUp().then(() => {
      console.log('Successfully cleaned up.');
    });
  });
