import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import {
  BaseTrade,
  MakerTrade,
  MultiAction,
  TakerTrade,
} from '../src/utils/types';
import { encodeMakerOrder, encodeTakerOrder } from '../src/services/encode';
import * as encode from '../src/services/encode';
import * as helpers from '../src/utils/helpers';
import * as constants from '../src/utils/constants';
import * as tickHelpers from '../src/utils/math/tickHelpers';
import { MockSigner } from './utils/MockSigner';
import { CommandType } from '../src/utils/routerCommands';
import { getCommand } from '../src/utils/routerCommands';
import { BigNumber } from 'ethers';
import { TickMath } from '@uniswap/v3-sdk';
import { makerOrder, swap } from '../src/services/send';

function utilSpy() {
  const spy: Record<string, sinon.SinonSpy> = {};

  const spyEncodeOrder = sinon.spy(encode, 'encodeTakerOrder');
  const spyEncodeMakerOrder = sinon.spy(encode, 'encodeMakerOrder');

  // single encoders
  const spyEncodeOpenAccount = sinon.spy(encode, 'encodeSingleOpenAccount');
  const spyEncodeSingleApprove = sinon.spy(encode, 'encodeSingleApprove');
  const spyEncodeSingleDepositETH = sinon.spy(encode, 'encodeSingleDepositETH');
  const spyEncodeSingleDepositERC20 = sinon.spy(
    encode,
    'encodeSingleDepositERC20',
  );
  const spyEncodeSingleWithdraw = sinon.spy(encode, 'encodeSingleWithdraw');
  const spyEncodeSingleSwap = sinon.spy(encode, 'encodeSingleSwap');

  // router call
  const spyEncodeRouterCall = sinon.spy(encode, 'encodeRouterCall');

  // utils
  const spyGetTokenInfo = sinon.spy(constants, 'getTokenInfo');
  const spyScaleAmount = sinon.spy(helpers, 'scaleAmount');
  const spyAccountId = sinon.spy(helpers, 'createAccountId');
  const spyGetSqrtRatioAtTick = sinon.spy(TickMath, 'getSqrtRatioAtTick');
  const spyClosestTickAndFixedRate = sinon.spy(
    tickHelpers,
    'closestTickAndFixedRate',
  );

  spy.encodeOrder = spyEncodeOrder;
  spy.encodeSingleOpenAccount = spyEncodeOpenAccount;
  spy.encodeSingleApprove = spyEncodeSingleApprove;
  spy.encodeSingleDepositETH = spyEncodeSingleDepositETH;
  spy.encodeSingleDepositERC20 = spyEncodeSingleDepositERC20;
  spy.encodeSingleWithdraw = spyEncodeSingleWithdraw;
  spy.encodeSingleSwap = spyEncodeSingleSwap;
  spy.scaleAmount = spyScaleAmount;
  spy.getTokenInfo = spyGetTokenInfo;
  spy.encodeRouterCall = spyEncodeRouterCall;
  spy.createAccountId = spyAccountId;
  spy.encodeMakerOrder = spyEncodeMakerOrder;
  spy.closestTickAndFixedRate = spyClosestTickAndFixedRate;
  spy.getSqrtRatioAtTick = spyGetSqrtRatioAtTick;
  spy.encodeSingleMakerOrder = sinon.spy(encode, 'encodeSingleMakerOrder');

  return spy;
}

function restoreAll(spy: Record<string, sinon.SinonSpy>) {
  Object.keys(spy).forEach((e) => spy[e]?.restore());
}

describe('takers', async () => {
  let mockSigner: MockSigner;
  let mockBaseTrade: BaseTrade;

  before(() => {
    mockSigner = new MockSigner(); // the args will be overwritten by stub above
    mockBaseTrade = {
      owner: mockSigner,
      productAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      maturityTimestamp: 1683274995,
      marketId: '1898738',
      quoteTokenAddress: '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557',
    };
  });

  it('init test', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 0,
      baseAmount: 0,
    };

    const expectedResult = encodeTakerOrder(trade);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeTakerOrder')
      .withArgs(trade)
      .returns(expectedResult);

    await swap(trade, 0);

    encodeMock.verify();
    encodeMock.restore();
  });

  it('account creation only', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 0,
      baseAmount: 0,
    };

    const expectedAccountID = await helpers.createAccountId(trade, false);
    const expectedMultiActionStage2 = new MultiAction();
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_OPEN_ACCOUNT, [expectedAccountID]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    sinon.assert.calledOnce(spy.encodeSingleOpenAccount);
    assert.equal(spy.encodeSingleOpenAccount.getCalls()[0].firstArg, trade);

    sinon.assert.calledOnce(spy.createAccountId);
    sinon.assert.calledWith(spy.createAccountId, trade, false);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('add margin ERC20', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 10,
      baseAmount: 0,
    };

    const expectedAccountID = await helpers.createAccountId(trade, false);
    const expectedMultiActionStage2 = new MultiAction();
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_OPEN_ACCOUNT, [expectedAccountID]),
    );
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        expectedAccountID,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    sinon.assert.calledOnce(spy.createAccountId);
    sinon.assert.calledWith(spy.createAccountId, trade, false);

    sinon.assert.calledOnce(spy.encodeSingleOpenAccount);
    assert.equal(spy.encodeSingleOpenAccount.getCalls()[0].firstArg, trade);

    sinon.assert.calledOnce(spy.encodeSingleApprove);
    assert.equal(
      spy.encodeSingleApprove.getCalls()[0].firstArg.toString(),
      BigNumber.from(10).toString(),
    );

    sinon.assert.calledOnce(spy.encodeSingleDepositERC20);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('add margin ETH', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 10,
      baseAmount: 0,
      accountId: '178633',
      quoteTokenAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    };

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        trade.accountId,
        trade.quoteTokenAddress,
        '0',
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    sinon.assert.notCalled(spy.encodeSingleApprove);

    sinon.assert.calledTwice(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'ETH');

    sinon.assert.calledOnce(spy.encodeSingleDepositETH);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(scaledAmount),
    );

    restoreAll(spy);
  });

  it('remove margin ERC20', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: -10,
      baseAmount: 0,
      accountId: '1827383',
    };

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      -trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_WITHDRAW, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    sinon.assert.notCalled(spy.encodeSingleApprove);

    sinon.assert.calledOnce(spy.encodeSingleWithdraw);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('remove margin ETH', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: -10,
      baseAmount: 0,
      accountId: '178633',
      quoteTokenAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    };

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      -trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_WITHDRAW, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    sinon.assert.notCalled(spy.encodeSingleApprove);

    sinon.assert.calledOnce(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'ETH');

    sinon.assert.calledOnce(spy.encodeSingleWithdraw);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from('0'),
    );

    restoreAll(spy);
  });

  it('account creation and trade', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 10,
      baseAmount: 30,
    };

    const expectedAccountID = await helpers.createAccountId(trade, false);
    const expectedMultiActionStage2 = new MultiAction();
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_OPEN_ACCOUNT, [expectedAccountID]),
    );
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        expectedAccountID,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
        expectedAccountID,
        trade.marketId,
        trade.maturityTimestamp,
        helpers.scaleAmount(trade.baseAmount, trade.quoteTokenAddress),
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    sinon.assert.calledOnce(spy.createAccountId);
    sinon.assert.calledWith(spy.createAccountId, trade, false);

    sinon.assert.calledOnce(spy.encodeSingleOpenAccount);
    assert.equal(spy.encodeSingleOpenAccount.getCalls()[0].firstArg, trade);

    // toto: stop calling it so often
    sinon.assert.calledThrice(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'USDC');

    sinon.assert.calledOnce(spy.encodeSingleApprove);
    assert.equal(
      spy.encodeSingleApprove.getCalls()[0].firstArg.toString(),
      BigNumber.from(10).toString(),
    );

    sinon.assert.calledOnce(spy.encodeSingleDepositERC20);

    sinon.assert.calledOnce(spy.encodeSingleSwap);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('trader FT with existing account id', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 10,
      baseAmount: 30,
      accountId: '18273003',
    };

    const expectedAccountID = await helpers.createAccountId(trade, false);
    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        helpers.scaleAmount(trade.baseAmount, trade.quoteTokenAddress),
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    // toto: stop calling it so often
    sinon.assert.calledThrice(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'USDC');

    sinon.assert.calledOnce(spy.encodeSingleApprove);
    assert.equal(
      spy.encodeSingleApprove.getCalls()[0].firstArg.toString(),
      BigNumber.from(10).toString(),
    );

    sinon.assert.calledOnce(spy.encodeSingleDepositERC20);

    sinon.assert.calledOnce(spy.encodeSingleSwap);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('trader without margin', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 0,
      baseAmount: 30,
      accountId: '18273003',
    };

    const expectedMultiActionStage2 = new MultiAction();
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        helpers.scaleAmount(trade.baseAmount, trade.quoteTokenAddress),
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    // toto: stop calling it so often
    sinon.assert.calledOnce(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'USDC');

    sinon.assert.calledOnce(spy.encodeSingleSwap);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('trader FT and remove margin', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: -10,
      baseAmount: 30.2,
      accountId: '18273003',
    };

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      -trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_WITHDRAW, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        helpers.scaleAmount(trade.baseAmount, trade.quoteTokenAddress),
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    // toto: stop calling it so often
    sinon.assert.calledTwice(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'USDC');

    sinon.assert.calledOnce(spy.encodeSingleWithdraw);
    sinon.assert.calledOnce(spy.encodeSingleSwap);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('trader VT and add margin', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: 10,
      baseAmount: -30,
      accountId: '18273003',
    };

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        helpers.scaleAmount(trade.baseAmount, trade.quoteTokenAddress),
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    // toto: stop calling it so often
    sinon.assert.calledThrice(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'USDC');

    sinon.assert.calledOnce(spy.encodeSingleApprove);
    assert.equal(
      spy.encodeSingleApprove.getCalls()[0].firstArg.toString(),
      BigNumber.from(10).toString(),
    );

    sinon.assert.calledOnce(spy.encodeSingleDepositERC20);

    sinon.assert.calledOnce(spy.encodeSingleSwap);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('trader VT and remove margin', async () => {
    const trade: TakerTrade = {
      ...mockBaseTrade,
      marginAmount: -10,
      baseAmount: 30.2,
      accountId: '18273003',
    };

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      -trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_WITHDRAW, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        helpers.scaleAmount(trade.baseAmount, trade.quoteTokenAddress),
      ]),
    );

    const spy = utilSpy();

    await swap(trade, 0);

    sinon.assert.calledOnce(spy.encodeOrder);
    sinon.assert.calledWith(spy.encodeOrder, trade);

    // toto: stop calling it so often
    sinon.assert.calledTwice(spy.getTokenInfo);
    assert.equal(spy.getTokenInfo.getCalls()[0].returnValue.name, 'USDC');

    sinon.assert.calledOnce(spy.encodeSingleWithdraw);
    sinon.assert.calledOnce(spy.encodeSingleSwap);

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });
});

describe('lps', async () => {
  let mockSigner: MockSigner;
  let mockBaseTrade: BaseTrade;

  before(() => {
    mockSigner = new MockSigner(); // the args will be overwritten by stub above
    mockBaseTrade = {
      owner: mockSigner,
      productAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      maturityTimestamp: 1683274995,
      marketId: '1898738',
      quoteTokenAddress: '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557',
    };
  });

  it('init test', async () => {
    const trade: MakerTrade = {
      owner: mockSigner,
      productAddress: '0x',
      maturityTimestamp: 1903,
      marketId: '0',
      quoteTokenAddress: '0x',
      marginAmount: 0,
      baseAmount: 0,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
    };

    const spy = sinon.spy(encodeMakerOrder);

    await makerOrder(trade, 0);

    spy.calledWith(trade);
  });

  it('account creation only - lp', async () => {
    const trade: MakerTrade = {
      ...mockBaseTrade,
      marginAmount: 0,
      baseAmount: 0,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
    };

    const expectedAccountID = await helpers.createAccountId(
      trade,
      true,
      trade.fixedRateLower,
      trade.fixedRateUpper,
    );
    const expectedMultiActionStage2 = new MultiAction();
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_OPEN_ACCOUNT, [expectedAccountID]),
    );

    const spy = utilSpy();

    await makerOrder(trade, 0);

    sinon.assert.calledOnce(spy.encodeMakerOrder);
    sinon.assert.calledWith(spy.encodeMakerOrder, trade);

    sinon.assert.calledOnce(spy.encodeSingleOpenAccount);
    assert.equal(spy.encodeSingleOpenAccount.getCalls()[0].firstArg, trade);

    sinon.assert.calledOnce(spy.createAccountId);
    sinon.assert.calledWith(
      spy.createAccountId,
      trade,
      true,
      trade.fixedRateLower,
      trade.fixedRateUpper,
    );

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('mint with existing account id', async () => {
    const trade: MakerTrade = {
      ...mockBaseTrade,
      marginAmount: 0,
      baseAmount: 1278,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
      accountId: '723677624',
    };

    const sqrtPriceLowerX96 = '11205778877017825642056062361';
    const sqrtPriceUpperX96 = '17732633948828052598660473723';

    const expectedMultiActionStage2 = new MultiAction();
    const scaledBaseAmount = helpers.scaleAmount(
      trade.baseAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_VAMM_EXCHANGE_LP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        sqrtPriceLowerX96,
        sqrtPriceUpperX96,
        scaledBaseAmount,
      ]), // to be modified
    );

    const spy = utilSpy();

    await makerOrder(trade, 0);

    sinon.assert.calledOnce(spy.encodeMakerOrder);
    sinon.assert.calledWith(spy.encodeMakerOrder, trade);

    sinon.assert.calledOnce(spy.encodeSingleMakerOrder);

    sinon.assert.calledTwice(spy.closestTickAndFixedRate);
    assert.equal(
      spy.closestTickAndFixedRate.firstCall.args[0],
      trade.fixedRateLower,
    );
    assert.equal(
      spy.closestTickAndFixedRate.secondCall.args[0],
      trade.fixedRateUpper,
    );
    assert.equal(spy.getSqrtRatioAtTick.callCount, 8);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[3].args[0], -39120);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[7].args[0], -29940);
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[3].toString(),
      sqrtPriceLowerX96,
    );
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[7].toString(),
      sqrtPriceUpperX96,
    );

    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('mint with margin', async () => {
    const trade: MakerTrade = {
      ...mockBaseTrade,
      marginAmount: 23,
      baseAmount: 1278,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
      accountId: '723677624',
    };

    const sqrtPriceLowerX96 = '11205778877017825642056062361';
    const sqrtPriceUpperX96 = '17732633948828052598660473723';

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    const scaledBaseAmount = helpers.scaleAmount(
      trade.baseAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_VAMM_EXCHANGE_LP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        sqrtPriceLowerX96,
        sqrtPriceUpperX96,
        scaledBaseAmount,
      ]), // to be modified
    );

    const spy = utilSpy();

    await makerOrder(trade, 0);

    sinon.assert.calledOnce(spy.encodeMakerOrder);
    sinon.assert.calledWith(spy.encodeMakerOrder, trade);

    sinon.assert.calledOnce(spy.encodeSingleApprove);
    assert.equal(
      spy.encodeSingleApprove.getCalls()[0].firstArg.toString(),
      BigNumber.from(23).toString(),
    );
    sinon.assert.calledOnce(spy.encodeSingleDepositERC20);
    sinon.assert.calledOnce(spy.encodeSingleMakerOrder);

    // ticks
    sinon.assert.calledTwice(spy.closestTickAndFixedRate);
    assert.equal(
      spy.closestTickAndFixedRate.firstCall.args[0],
      trade.fixedRateLower,
    );
    assert.equal(
      spy.closestTickAndFixedRate.secondCall.args[0],
      trade.fixedRateUpper,
    );
    assert.equal(spy.getSqrtRatioAtTick.callCount, 8);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[3].args[0], -39120);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[7].args[0], -29940);
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[3].toString(),
      sqrtPriceLowerX96,
    );
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[7].toString(),
      sqrtPriceUpperX96,
    );

    // router command
    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('mint and remove margin', async () => {
    const trade: MakerTrade = {
      ...mockBaseTrade,
      marginAmount: -23,
      baseAmount: 1278,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
      accountId: '723677624',
    };

    const sqrtPriceLowerX96 = '11205778877017825642056062361';
    const sqrtPriceUpperX96 = '17732633948828052598660473723';

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      -trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_WITHDRAW, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    const scaledBaseAmount = helpers.scaleAmount(
      trade.baseAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_VAMM_EXCHANGE_LP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        sqrtPriceLowerX96,
        sqrtPriceUpperX96,
        scaledBaseAmount,
      ]), // to be modified
    );

    const spy = utilSpy();

    await makerOrder(trade, 0);

    sinon.assert.calledOnce(spy.encodeMakerOrder);
    sinon.assert.calledWith(spy.encodeMakerOrder, trade);

    sinon.assert.notCalled(spy.encodeSingleApprove);
    sinon.assert.calledOnce(spy.encodeSingleWithdraw);
    sinon.assert.calledOnce(spy.encodeSingleMakerOrder);

    // ticks
    sinon.assert.calledTwice(spy.closestTickAndFixedRate);
    assert.equal(
      spy.closestTickAndFixedRate.firstCall.args[0],
      trade.fixedRateLower,
    );
    assert.equal(
      spy.closestTickAndFixedRate.secondCall.args[0],
      trade.fixedRateUpper,
    );
    assert.equal(spy.getSqrtRatioAtTick.callCount, 8);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[3].args[0], -39120);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[7].args[0], -29940);
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[3].toString(),
      sqrtPriceLowerX96,
    );
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[7].toString(),
      sqrtPriceUpperX96,
    );

    // router command
    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('burn and remove margin', async () => {
    const trade: MakerTrade = {
      ...mockBaseTrade,
      marginAmount: -23,
      baseAmount: -1278,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
      accountId: '723677624',
    };

    const sqrtPriceLowerX96 = '11205778877017825642056062361';
    const sqrtPriceUpperX96 = '17732633948828052598660473723';

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      -trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_WITHDRAW, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    const scaledBaseAmount = helpers.scaleAmount(
      trade.baseAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_VAMM_EXCHANGE_LP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        sqrtPriceLowerX96,
        sqrtPriceUpperX96,
        scaledBaseAmount,
      ]), // to be modified
    );

    const spy = utilSpy();

    await makerOrder(trade, 0);

    sinon.assert.calledOnce(spy.encodeMakerOrder);
    sinon.assert.calledWith(spy.encodeMakerOrder, trade);

    sinon.assert.notCalled(spy.encodeSingleApprove);
    sinon.assert.calledOnce(spy.encodeSingleWithdraw);
    sinon.assert.calledOnce(spy.encodeSingleMakerOrder);

    // ticks
    sinon.assert.calledTwice(spy.closestTickAndFixedRate);
    assert.equal(
      spy.closestTickAndFixedRate.firstCall.args[0],
      trade.fixedRateLower,
    );
    assert.equal(
      spy.closestTickAndFixedRate.secondCall.args[0],
      trade.fixedRateUpper,
    );
    assert.equal(spy.getSqrtRatioAtTick.callCount, 8);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[3].args[0], -39120);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[7].args[0], -29940);
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[3].toString(),
      sqrtPriceLowerX96,
    );
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[7].toString(),
      sqrtPriceUpperX96,
    );

    // router command
    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });

  it('burn and add margin', async () => {
    const trade: MakerTrade = {
      ...mockBaseTrade,
      marginAmount: 23,
      baseAmount: -1278,
      fixedRateLower: 0.02,
      fixedRateUpper: 0.05,
      accountId: '723677624',
    };

    const sqrtPriceLowerX96 = '11205778877017825642056062361';
    const sqrtPriceUpperX96 = '17732633948828052598660473723';

    const expectedMultiActionStage2 = new MultiAction();
    const scaledAmount = helpers.scaleAmount(
      trade.marginAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_CORE_DEPOSIT, [
        trade.accountId,
        trade.quoteTokenAddress,
        scaledAmount,
      ]),
    );
    const scaledBaseAmount = helpers.scaleAmount(
      trade.baseAmount,
      trade.quoteTokenAddress,
    );
    expectedMultiActionStage2.newAction(
      getCommand(CommandType.V2_VAMM_EXCHANGE_LP, [
        trade.accountId,
        trade.marketId,
        trade.maturityTimestamp,
        sqrtPriceLowerX96,
        sqrtPriceUpperX96,
        scaledBaseAmount,
      ]), // to be modified
    );

    const spy = utilSpy();

    await makerOrder(trade, 0);

    sinon.assert.calledOnce(spy.encodeMakerOrder);
    sinon.assert.calledWith(spy.encodeMakerOrder, trade);

    sinon.assert.calledOnce(spy.encodeSingleApprove);
    assert.equal(
      spy.encodeSingleApprove.getCalls()[0].firstArg.toString(),
      BigNumber.from(23).toString(),
    );
    sinon.assert.calledOnce(spy.encodeSingleDepositERC20);
    sinon.assert.calledOnce(spy.encodeSingleMakerOrder);

    // ticks
    sinon.assert.calledTwice(spy.closestTickAndFixedRate);
    assert.equal(
      spy.closestTickAndFixedRate.firstCall.args[0],
      trade.fixedRateLower,
    );
    assert.equal(
      spy.closestTickAndFixedRate.secondCall.args[0],
      trade.fixedRateUpper,
    );
    assert.equal(spy.getSqrtRatioAtTick.callCount, 8);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[3].args[0], -39120);
    assert.equal(spy.getSqrtRatioAtTick.getCalls()[7].args[0], -29940);
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[3].toString(),
      sqrtPriceLowerX96,
    );
    assert.equal(
      spy.getSqrtRatioAtTick.returnValues[7].toString(),
      sqrtPriceUpperX96,
    );

    // router command
    sinon.assert.calledOnce(spy.encodeRouterCall);
    sinon.assert.calledWith(
      spy.encodeRouterCall,
      expectedMultiActionStage2,
      BigNumber.from(0),
    );

    restoreAll(spy);
  });
});
