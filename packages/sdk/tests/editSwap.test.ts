import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { encodeSwap } from '../src/services/swap/encode';
import * as encode from '../src/services/swap/encode';
import * as getPositionInfoFile from '../src/gateway/getPositionInfo';
import * as constants from '../src/utils/constants';
import { MockSigner } from './utils/MockSigner';
import { BigNumber } from 'ethers';
import {
  SwapPeripheryParameters,
  SwapUserInputs,
} from '../src/services/swap/types';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { PoolConfig, PoolInfo, PositionInfo } from '../src/gateway/types';
import { simulateEditSwap, editSwap } from '../src/services/editSwap/editSwap';

describe('edit swap', async () => {
  let mockSigner: MockSigner;
  let poolConfig: PoolConfig;

  before(() => {
    mockSigner = new MockSigner(1); // the args will be overwritten by stub above
    poolConfig = {
      productAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      maturityTimestamp:
        Math.round(Date.now() / 1000) + constants.SECONDS_IN_YEAR,
      marketId: '1898738',
      quoteTokenAddress: '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557',
      quoteTokenDecimals: 6,
      isETH: false,
      chainId: 1,
    };
  });

  it('edit swap test', async () => {
    const swapUserInputs: SwapUserInputs = {
      owner: mockSigner,
      baseAmount: BigNumber.from(9990009990),
      margin: BigNumber.from(10000000),
      liquidatorBooster: BigNumber.from(0),
    };

    const poolInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.001,
    };

    const positionInfo: PositionInfo = {
      ...poolInfo,
      positionMargin: 30,
      accountId: '19083',
      fixedRateLower: 0,
      fixedRateUpper: 0,
    };

    const swapPeripheryParams: SwapPeripheryParameters = {
      ...positionInfo,
      ...swapUserInputs,
    };

    const expectedResult = await encodeSwap(swapPeripheryParams);

    const getPositionInfoMock = sinon.mock(getPositionInfoFile);
    getPositionInfoMock
      .expects('getPositionInfo')
      .withArgs('1_19083', 1, await mockSigner.getAddress())
      .returns(positionInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeSwap')
      .withArgs(swapPeripheryParams)
      .returns(expectedResult);

    await editSwap({
      positionId: '1_19083',
      signer: mockSigner,
      notional: 10000,
      margin: 10,
    });

    encodeMock.verify();
    getPositionInfoMock.verify();
    encodeMock.restore();
    getPositionInfoMock.restore();
  });

  it('infoPostEditSwap test', async () => {
    const accountId = '19083';
    const positionId = '1_19083';

    const swapUserInputs: SwapUserInputs = {
      owner: mockSigner,
      baseAmount: BigNumber.from(9990009990),
      margin: BigNumber.from(10000000),
      liquidatorBooster: BigNumber.from(0),
    };

    const poolInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.001,
    };

    const positionInfo: PositionInfo = {
      ...poolInfo,
      positionMargin: 50,
      accountId: accountId,
      fixedRateLower: 0,
      fixedRateUpper: 0,
    };

    const swapPeripheryParams = {
      ...positionInfo,
      ...swapUserInputs,
    };

    const expectedResult = await encodeSwap(swapPeripheryParams);

    const getPositionInfoMock = sinon.mock(getPositionInfoFile);
    getPositionInfoMock
      .expects('getPositionInfo')
      .withArgs(positionId, 1, await mockSigner.getAddress())
      .returns(positionInfo);

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
      ['500000000', '-500000000', '20000000', '30000000', 660],
    );
    const array: string[] = [encodedSwapOutput];
    const simulationOutput = defaultAbiCoder.encode([`bytes[]`], [array]);
    mockSigner.setFunctionOutputData(simulationOutput);

    const result = await simulateEditSwap({
      positionId: positionId,
      signer: mockSigner,
      notional: 10000,
      margin: 10,
    });

    encodeMock.verify();
    getPositionInfoMock.verify();
    encodeMock.restore();
    getPositionInfoMock.restore();

    assert.equal(result.marginRequirement, 30);
    assert.equal(result.maxMarginWithdrawable, 20);
    assert.equal(result.availableNotional, 500.5);
    assert.equal(result.fee, 20);
    assert.equal(result.slippage.toFixed(3), '0.074');
    assert.equal(result.averageFixedRate.toFixed(3), '199.900');
    assert.equal(result.fixedTokenDeltaBalance, -500);
    assert.equal(result.variableTokenDeltaBalance, 500);
    assert.equal(result.fixedTokenDeltaUnbalanced, -500);
  });
});
