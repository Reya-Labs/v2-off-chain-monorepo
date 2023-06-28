import { TakerTrade } from '../src/utils/types';
import { createAccountId } from '../src/utils/helpers';
import { MockSigner } from './utils/MockSigner';
import { assert, expect } from 'chai';
import { BigNumber } from 'ethers';
import {
  CommandType,
  createCommand,
  getCommand,
} from '../src/utils/routerCommands';
import { defaultAbiCoder } from 'ethers/lib/utils';

describe('helpers', async () => {
  it('account id creation - correct format', async () => {
    const trade: TakerTrade = {
      owner: new MockSigner(1),
      productAddress: '0x0',
      maturityTimestamp: 1903,
      marketId: '0',
      quoteTokenAddress: '0x',
      marginAmount: 0,
      baseAmount: 0,
    };

    const traderAccountId1 = await createAccountId({
      ownerAddress: await trade.owner.getAddress(),
      productAddress: trade.productAddress,
      marketId: trade.marketId,
      maturityTimestamp: trade.maturityTimestamp,
      isLp: false,
    });
    const traderAccountId2 = await createAccountId({
      ownerAddress: await trade.owner.getAddress(),
      productAddress: trade.productAddress,
      marketId: trade.marketId,
      maturityTimestamp: 1904,
      isLp: false,
    });

    expect(true).to.be.eq(traderAccountId2 !== traderAccountId1);
    expect(true).to.be.eq(
      traderAccountId2 <= '340282366920938463463374607431768211456',
    );
    expect(true).to.be.eq(
      traderAccountId1 <= '340282366920938463463374607431768211456',
    );
    expect(true).to.be.eq(/^\d+$/.test(traderAccountId1));
    expect(true).to.be.eq(/^\d+$/.test(traderAccountId2));
  });

  it('account id creation - collision', async () => {
    const trade: TakerTrade = {
      owner: new MockSigner(1),
      productAddress: '0x0',
      maturityTimestamp: 1903,
      marketId: '0',
      quoteTokenAddress: '0x',
      marginAmount: 0,
      baseAmount: 0,
    };

    const arr = new Array<string>();

    for (let i = 0; i < 100; i++) {
      const traderAccountId = await createAccountId({
        ownerAddress: await trade.owner.getAddress(),
        productAddress: trade.productAddress,
        marketId: trade.marketId,
        maturityTimestamp: i,
        isLp: false,
      });
      expect(false).to.be.eq(arr.includes(traderAccountId));
      arr.push(traderAccountId);
    }
  });

  it('create command', async () => {
    expect(() => createCommand(CommandType.WRAP_ETH, [1, 2])).to.throw();

    let command = createCommand(CommandType.V2_CORE_CREATE_ACCOUNT, [1]);
    let result = defaultAbiCoder.decode(['uint128'], command.encodedInput);
    assert.isTrue(result[0].eq(BigNumber.from(1)));

    command = createCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
      '1',
      '1526',
      '1678555',
      '-182973783',
      '2818276636',
    ]);
    result = defaultAbiCoder.decode(
      ['uint128', 'uint128', 'uint32', 'int256', 'uint160'],
      command.encodedInput,
    );
    assert.isTrue(result[0].eq(BigNumber.from(1)));
    assert.isTrue(result[1].eq(BigNumber.from(1526)));
    assert.isTrue(result[2] === 1678555);
    assert.isTrue(
      result[3].eq(BigNumber.from(0).sub(BigNumber.from('182973783'))),
    );
  });

  it('get command', async () => {
    const res = getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
      '1',
      '1526',
      '1678555',
      '-182973783',
      '2818276636',
    ]);
    assert.equal(res.command, '00');

    const res1 = getCommand(CommandType.V2_CORE_CREATE_ACCOUNT, [1]);
    assert.equal(res1.command, '03');
    assert.equal(
      res1.input,
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    );
  });
});
