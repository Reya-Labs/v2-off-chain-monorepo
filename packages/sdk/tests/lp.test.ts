import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { encodeLp } from '../src/services/lp/encode';
import { simulateLp, lp } from '../src/services/lp/lp';
import * as encode from '../src/services/lp/encode';
import * as getPoolInfoFile from '../src/gateway/getPoolInfo';
import { MockSigner } from './utils/MockSigner';
import { BigNumber } from 'ethers';
import { LpPeripheryParameters, LpUserInputs } from '../src/services/lp/types';
import { PoolConfig, PoolInfo } from '../src/gateway/types';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { SECONDS_IN_YEAR } from '../src/utils/constants';

describe('makers', async () => {
  let mockSigner: MockSigner;
  let poolConfig: PoolConfig;

  before(() => {
    mockSigner = new MockSigner(1); // the args will be overwritten by stub above
    poolConfig = {
      productAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      maturityTimestamp: Math.round(Date.now() / 1000) + SECONDS_IN_YEAR,
      marketId: '1898738',
      quoteTokenAddress: '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557',
      quoteTokenDecimals: 6,
      isETH: false,
      chainId: 1,
    };
  });

  it('lp test', async () => {
    const ammId = '1234';

    const lpUserInputs: LpUserInputs = {
      owner: mockSigner,
      liquidityAmount: BigNumber.from(44191932505),
      margin: BigNumber.from(10000000),
      fixedLow: 1,
      fixedHigh: 1.5, // closest rate = 1.053776
    };

    const poolInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.001,
    };

    const lpPeripheryParams: LpPeripheryParameters = {
      ...poolInfo,
      ...lpUserInputs,
    };

    const expectedResult = await encodeLp(lpPeripheryParams);

    const getPoolInfoMock = sinon.mock(getPoolInfoFile);
    getPoolInfoMock.expects('getPoolInfo').withArgs(ammId, 1).returns(poolInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeLp')
      .withArgs(lpPeripheryParams)
      .returns(expectedResult);

    await lp({
      ammId: ammId,
      signer: mockSigner,
      notional: 10000,
      margin: 10,
      fixedLow: 1,
      fixedHigh: 1.5,
    });

    encodeMock.verify();
    getPoolInfoMock.verify();
    encodeMock.restore();
    getPoolInfoMock.restore();
  });

  it('infoPostLp test', async () => {
    const ammId = '1234';

    const lpUserInputs: LpUserInputs = {
      owner: mockSigner,
      liquidityAmount: BigNumber.from(44191932505),
      margin: BigNumber.from(10000000),
      fixedLow: 1,
      fixedHigh: 1.5, // closest rate = 1.053776
    };

    const poolInfo: PoolInfo = {
      ...poolConfig,
      currentFixedRate: 1.01,
      currentLiquidityIndex: 1.001,
    };

    const lpPeripheryParams: LpPeripheryParameters = {
      ...poolInfo,
      ...lpUserInputs,
    };

    const expectedResult = await encodeLp(lpPeripheryParams);

    const getPoolInfoMock = sinon.mock(getPoolInfoFile);
    getPoolInfoMock.expects('getPoolInfo').withArgs(ammId, 1).returns(poolInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeLp')
      .withArgs(lpPeripheryParams)
      .onFirstCall()
      .returns(expectedResult);

    const encodedLpOutput = defaultAbiCoder.encode(
      ['uint256', 'uint256'],
      ['20', '30'],
    );
    const array: string[] = [encodedLpOutput];
    const simulationOutput = defaultAbiCoder.encode([`bytes[]`], [array]);
    mockSigner.setFunctionOutputData(simulationOutput);

    const result = await simulateLp({
      ammId: '1234',
      signer: mockSigner,
      notional: 10000,
      margin: 10,
      fixedLow: 1,
      fixedHigh: 1.5,
    });

    encodeMock.verify();
    getPoolInfoMock.verify();
    encodeMock.restore();
    getPoolInfoMock.restore();

    assert.equal(result.marginRequirement, 0.00003);
    assert.equal(result.maxMarginWithdrawable, 0);
    assert.equal(result.fee, 0.00002);
  });
});
