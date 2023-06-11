import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import {
  BaseTrade,
  MakerTrade,
  MultiAction,
  TakerTrade,
} from '../src/utils/types';
import { encodeSwap } from '../src/services/swap/encode';
import { getInfoPostSwap, swap } from '../src/services/swap/swap';
import {
  encodeSingleCreateAccount,
  encodeSingleSwap,
  encodeDeposit,
} from '../src/services/encode';
import * as encode from '../src/services/swap/encode';
import * as getSwapPeripheryParamsFile from '../src/services/swap/getSwapPeripheryParams';
import { getSwapPeripheryParams } from '../src/services/swap/getSwapPeripheryParams';
import * as encodeSingle from '../src/services/encode';
import * as helpers from '../src/utils/helpers';
import * as constants from '../src/utils/constants';
import * as commons from '@voltz-protocol/commons-v2';
import * as tickHelpers from '../src/utils/math/tickHelpers';
import { MockSigner } from './utils/MockSigner';
import { CommandType } from '../src/utils/routerCommands';
import { getCommand } from '../src/utils/routerCommands';
import { BigNumber } from 'ethers';
import { TickMath } from '@uniswap/v3-sdk';
import {
  getTokenDetails,
  scale,
  descale,
  SECONDS_IN_YEAR,
} from '@voltz-protocol/commons-v2';
import {
  PoolConfig,
  PoolInfo,
  SwapParipheryParameters,
  SwapUserInputs,
} from '../src/services/swap/types';
import { defaultAbiCoder } from 'ethers/lib/utils';

function utilSpy() {
  const spy: Record<string, sinon.SinonSpy> = {};

  const spyEncodeOrder = sinon.spy(encode, 'encodeSwap');

  // single encoders
  const spyEncodeOpenAccount = sinon.spy(
    encodeSingle,
    'encodeSingleCreateAccount',
  );
  const spyEncodeSingleSwap = sinon.spy(encodeSingle, 'encodeSingleSwap');
  const spyEncodeDeposit = sinon.spy(encodeSingle, 'encodeDeposit');

  // router call
  const spyEncodeRouterCall = sinon.spy(encodeSingle, 'encodeRouterCall');

  // utils
  const spyGetTokenInfo = sinon.spy(commons, 'getTokenDetails');
  const spyScaleAmount = sinon.spy(commons, 'scale');
  const spyDescaleAmount = sinon.spy(commons, 'descale');
  const spyAccountId = sinon.spy(helpers, 'createAccountId');
  const spyGetSqrtRatioAtTick = sinon.spy(TickMath, 'getSqrtRatioAtTick');
  const spyClosestTickAndFixedRate = sinon.spy(
    tickHelpers,
    'closestTickAndFixedRate',
  );

  spy.encodeOrder = spyEncodeOrder;
  spy.encodeSingleCreateAccount = spyEncodeOpenAccount;
  spy.encodeSingleSwap = spyEncodeSingleSwap;
  spy.scaleAmount = spyScaleAmount;
  spy.getTokenInfo = spyGetTokenInfo;
  spy.encodeRouterCall = spyEncodeRouterCall;
  spy.createAccountId = spyAccountId;
  spy.closestTickAndFixedRate = spyClosestTickAndFixedRate;
  spy.getSqrtRatioAtTick = spyGetSqrtRatioAtTick;

  return spy;
}

function restoreAll(spy: Record<string, sinon.SinonSpy>) {
  Object.keys(spy).forEach((e) => spy[e]?.restore());
}

describe('takers', async () => {
  let mockSigner: MockSigner;
  let poolConfig: PoolConfig;

  before(() => {
    mockSigner = new MockSigner(); // the args will be overwritten by stub above
    poolConfig = {
      productAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      maturityTimestamp: 1683274995,
      marketId: '1898738',
      quoteTokenAddress: '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557',
    };
  });

  it('swap test', async () => {
    const swapUserInputs: SwapUserInputs = {
      owner: mockSigner,
      baseAmount: BigNumber.from(9900990099),
      marginAmount: BigNumber.from(10000000),
    };

    const swapInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.01,
    };

    const swapPeripheryParams: SwapParipheryParameters = {
      ...swapInfo,
      ...swapUserInputs,
      priceLimit: constants.ZERO_BN,
    };

    const expectedResult = await encodeSwap(swapPeripheryParams);

    const getSwapPeripheryParamsMock = sinon.mock(getSwapPeripheryParamsFile);
    getSwapPeripheryParamsMock
      .expects('getSwapPeripheryParams')
      .withArgs('1234')
      .returns(swapInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeSwap')
      .withArgs(swapPeripheryParams)
      .returns(expectedResult);

    await swap({
      poolId: '1234',
      signer: mockSigner,
      notionalAmount: 10000,
      marginAmount: 10,
    });

    encodeMock.verify();
    getSwapPeripheryParamsMock.verify();
    encodeMock.restore();
    getSwapPeripheryParamsMock.restore();
  });

  it('infoPostSwap test', async () => {
    const swapUserInputs: SwapUserInputs = {
      owner: mockSigner,
      baseAmount: BigNumber.from(9900990099),
      marginAmount: BigNumber.from(10000000),
    };

    const swapInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.01,
    };

    const swapPeripheryParams: SwapParipheryParameters = {
      ...swapInfo,
      ...swapUserInputs,
      priceLimit: constants.ZERO_BN,
    };

    const expectedResult = await encodeSwap(swapPeripheryParams);

    const getSwapPeripheryParamsMock = sinon.mock(getSwapPeripheryParamsFile);
    getSwapPeripheryParamsMock
      .expects('getSwapPeripheryParams')
      .withArgs('1234')
      .returns(swapInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeSwap')
      .withArgs(swapPeripheryParams)
      .onFirstCall()
      .returns(expectedResult);
    encodeMock
      .expects('encodeSwap')
      .withArgs({
        ...swapPeripheryParams,
        baseAmount: constants.VERY_BIG_NUMBER,
      })
      .onFirstCall()
      .returns(expectedResult);

    const encodedSwapOutput = defaultAbiCoder.encode(
      ['int256', 'int256', 'uint256', 'uint256', 'int24'],
      ['500', '-500', '20', '30', 660],
    );
    const array: string[] = [encodedSwapOutput];
    const simulationOutput = defaultAbiCoder.encode([`bytes[]`], [array]);
    mockSigner.setFunctionOutputData(simulationOutput);

    const result = await getInfoPostSwap({
      poolId: '1234',
      signer: mockSigner,
      notionalAmount: 10000,
      marginAmount: 10,
    });

    encodeMock.verify();
    getSwapPeripheryParamsMock.verify();
    encodeMock.restore();
    getSwapPeripheryParamsMock.restore();

    assert.equal(result.marginRequirement, 0.00003);
    assert.equal(result.maxMarginWithdrawable, 0);
    assert.equal(result.availableNotional, 0.000505);
    assert.equal(result.fee, 0.00002);
    assert.equal(result.slippage.toFixed(3), '0.074');
    assert.equal(result.averageFixedRate.toFixed(3), '0.203');
    assert.equal(result.fixedTokenDeltaBalance, -0.0005);
    assert.equal(result.variableTokenDeltaBalance, 0.0005);
    assert.equal(result.fixedTokenDeltaUnbalanced, -0.0005);
  });
});
