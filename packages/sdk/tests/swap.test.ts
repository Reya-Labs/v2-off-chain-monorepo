import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { encodeSwap } from '../src/services/swap/encode';
import { simulateSwap, swap } from '../src/services/swap/swap';
import * as encode from '../src/services/swap/encode';
import * as getPoolInfoFile from '../src/gateway/getPoolInfo';
import * as constants from '../src/utils/constants';
import { MockSigner } from './utils/MockSigner';
import { BigNumber } from 'ethers';
import {
  SwapPeripheryParameters,
  SwapUserInputs,
} from '../src/services/swap/types';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { PoolConfig, PoolInfo } from '../src/gateway/types';

describe('takers', async () => {
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

  it('swap test', async () => {
    const swapUserInputs: SwapUserInputs = {
      owner: mockSigner,
      baseAmount: BigNumber.from(9900990099),
      margin: BigNumber.from(10000000),
    };

    const poolInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.01,
    };

    const swapPeripheryParams: SwapPeripheryParameters = {
      ...poolInfo,
      ...swapUserInputs,
      fixedRateLimit: constants.ZERO_BN,
    };

    const expectedResult = await encodeSwap(swapPeripheryParams);

    const getPoolInfoMock = sinon.mock(getPoolInfoFile);
    getPoolInfoMock
      .expects('getPoolInfo')
      .withArgs('1234', 1)
      .returns(poolInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeSwap')
      .withArgs(swapPeripheryParams)
      .returns(expectedResult);

    await swap({
      ammId: '1234',
      signer: mockSigner,
      notional: 10000,
      margin: 10,
    });

    encodeMock.verify();
    getPoolInfoMock.verify();
    encodeMock.restore();
    getPoolInfoMock.restore();
  });

  it('infoPostSwap test', async () => {
    const swapUserInputs: SwapUserInputs = {
      owner: mockSigner,
      baseAmount: BigNumber.from(9900990099),
      margin: BigNumber.from(10000000),
    };

    const poolInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.01,
    };

    const swapPeripheryParams: SwapPeripheryParameters = {
      ...poolInfo,
      ...swapUserInputs,
      fixedRateLimit: constants.ZERO_BN,
    };

    const expectedResult = await encodeSwap(swapPeripheryParams);

    const getPoolInfoMock = sinon.mock(getPoolInfoFile);
    getPoolInfoMock
      .expects('getPoolInfo')
      .withArgs('1234', 1)
      .returns(poolInfo);

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

    const result = await simulateSwap({
      ammId: '1234',
      signer: mockSigner,
      notional: 10000,
      margin: 10,
    });

    encodeMock.verify();
    getPoolInfoMock.verify();
    encodeMock.restore();
    getPoolInfoMock.restore();

    assert.equal(result.marginRequirement, 0.00003);
    assert.equal(result.maxMarginWithdrawable, 0);
    assert.equal(result.availableNotional, 0.000505);
    assert.equal(result.fee, 0.00002);
    assert.equal(result.slippage.toFixed(3), '0.074');
    assert.equal(result.averageFixedRate.toFixed(3), '199.010');
    assert.equal(result.fixedTokenDeltaBalance, -0.0005);
    assert.equal(result.variableTokenDeltaBalance, 0.0005);
    assert.equal(result.fixedTokenDeltaUnbalanced, -0.0005);
  });
});
