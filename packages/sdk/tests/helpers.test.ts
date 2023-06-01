import { TakerTrade } from '../src/utils/types';
import { createAccountId, scaleAmount } from '../src/utils/helpers';
import { MockSigner } from './utils/MockSigner';
import { assert, expect } from 'chai';
import { BigNumber } from 'ethers';
import {
  createCommand,
  CommandType,
  getCommand,
} from '../src/utils/routerCommands';
import { defaultAbiCoder } from 'ethers/lib/utils';

function approx(a: string, b: string, range: number) {
  const bnB = BigNumber.from(b);
  const bnA = BigNumber.from(a);
  assert.isTrue(
    bnB
      .sub(bnA)
      .abs()
      .lt(bnA.div(1 / range)),
  );
}

describe('helpers', async () => {
  it('account id creation - correct format', async () => {
    const trade: TakerTrade = {
      owner: new MockSigner(),
      productAddress: '0x0',
      maturityTimestamp: 1903,
      marketId: '0',
      quoteTokenAddress: '0x',
      marginAmount: 0,
      baseAmount: 0,
    };

    const traderAccountId1 = await createAccountId(trade, false);
    const traderAccountId2 = await createAccountId(
      { ...trade, maturityTimestamp: 1904 },
      false,
    );

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
      owner: new MockSigner(),
      productAddress: '0x0',
      maturityTimestamp: 1903,
      marketId: '0',
      quoteTokenAddress: '0x',
      marginAmount: 0,
      baseAmount: 0,
    };

    const arr = new Array<string>();

    for (let i = 0; i < 100; i++) {
      const traderAccountId = await createAccountId(
        { ...trade, maturityTimestamp: i },
        false,
      );
      expect(false).to.be.eq(arr.includes(traderAccountId));
      arr.push(traderAccountId);
    }
  });

  it('scale amount', async () => {
    const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const dai = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60';
    const wadSuffix = '000000000000000000';
    const sixDecimalsSuffix = '000000';

    // usdc
    let scaled = scaleAmount(1893, usdc);
    assert.equal(scaled, '1893'.concat(sixDecimalsSuffix));
    scaled = scaleAmount(18.93, usdc);
    assert.equal(scaled, '1893'.concat(sixDecimalsSuffix.slice(2)));
    scaled = scaleAmount(0.00093, usdc);
    assert.equal(scaled, '930');
    scaled = scaleAmount(0.0000093, usdc);
    assert.equal(scaled, '9');
    scaled = scaleAmount(10893000000, usdc); // 10B
    assert.equal(scaled, '10893000000'.concat(sixDecimalsSuffix));

    // dai
    scaled = scaleAmount(1893, dai);
    assert.equal(scaled, '1893'.concat(wadSuffix));
    scaled = scaleAmount(18.93, dai);
    approx(scaled, '1893'.concat(wadSuffix.slice(2)), 0.0001);
    scaled = scaleAmount(0.00093, dai);
    assert.equal(scaled, '93'.concat(wadSuffix.slice(5)));
    scaled = scaleAmount(0.0000093, dai);
    assert.equal(scaled, '93'.concat(wadSuffix.slice(7)));
    scaled = scaleAmount(0.000000000000000093, dai);
    assert.equal(scaled, '93');
    scaled = scaleAmount(0.0000000000000000093, dai);
    assert.equal(scaled, '9');
    scaled = scaleAmount(10893000000, dai); // 10B
    assert.equal(scaled, '10893000000'.concat(wadSuffix));
  });

  it('create command', async () => {
    expect(() => createCommand(CommandType.WRAP_ETH, [1, 2])).to.throw();

    let command = createCommand(CommandType.V2_OPEN_ACCOUNT, [1]);
    let result = defaultAbiCoder.decode(['uint128'], command.encodedInput);
    assert.isTrue(result[0].eq(BigNumber.from(1)));

    command = createCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
      '1',
      '1526',
      '1678555',
      '-182973783',
    ]);
    result = defaultAbiCoder.decode(
      ['uint128', 'uint128', 'uint32', 'int256'],
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
    ]);
    assert.equal(res.command, '00');

    const res1 = getCommand(CommandType.V2_OPEN_ACCOUNT, [1]);
    assert.equal(res1.command, '08');
    assert.equal(
      res1.input,
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    );
  });
});
