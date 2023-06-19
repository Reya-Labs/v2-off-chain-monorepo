import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { encodeLp } from '../src/services/lp/encode';
import { simulateEditLp, editLp } from '../src/services/editLp/editLp';
import * as encode from '../src/services/lp/encode';
import * as getPositionInfoFile from '../src/gateway/getPositionInfo';
import { MockSigner } from './utils/MockSigner';
import { BigNumber } from 'ethers';
import { EditLpPeripheryParameters } from '../src/services/editLp/types';
import { PoolConfig, PoolInfo, PositionInfo } from '../src/gateway/types';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { LpUserInputs } from '../src/services/lp';
import { SECONDS_IN_YEAR } from '../src/utils/constants';

describe('edit makers', async () => {
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

  it('edit lp test', async () => {
    const ammId = '1234';
    const positionId = '1_1738838';
    const accountId = '1738838';

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

    const positionInfo: PositionInfo = {
      ...poolInfo,
      positionMargin: 30,
      accountId: accountId,
      fixedRateLower: 1,
      fixedRateUpper: 1.5,
    };

    const lpPeripheryParams: EditLpPeripheryParameters = {
      ...positionInfo,
      ...lpUserInputs,
    };

    const expectedResult = await encodeLp(lpPeripheryParams);

    const getPositionInfoMock = sinon.mock(getPositionInfoFile);
    getPositionInfoMock
      .expects('getPositionInfo')
      .withArgs(positionId, 1, await mockSigner.getAddress())
      .returns(positionInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeLp')
      .withArgs(lpPeripheryParams)
      .returns(expectedResult);

    await editLp({
      positionId: positionId,
      signer: mockSigner,
      notional: 10000,
      margin: 10,
    });

    encodeMock.verify();
    getPositionInfoMock.verify();
    encodeMock.restore();
    getPositionInfoMock.restore();
  });

  it('infoPostEditLp test', async () => {
    const ammId = '1234';
    const positionId = '1_1738838';
    const accountId = '1738838';

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

    const positionInfo: PositionInfo = {
      ...poolInfo,
      positionMargin: 30,
      accountId: accountId,
      fixedRateLower: 1,
      fixedRateUpper: 1.5,
    };

    const lpPeripheryParams: EditLpPeripheryParameters = {
      ...positionInfo,
      ...lpUserInputs,
    };

    const expectedResult = await encodeLp(lpPeripheryParams);

    const getPositionInfoMock = sinon.mock(getPositionInfoFile);
    getPositionInfoMock
      .expects('getPositionInfo')
      .withArgs(positionId, 1, await mockSigner.getAddress())
      .returns(positionInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeLp')
      .withArgs(lpPeripheryParams)
      .onFirstCall()
      .returns(expectedResult);

    const encodedLpOutput = defaultAbiCoder.encode(
      ['uint256', 'uint256'],
      ['20', '3000000'],
    );
    const array: string[] = [encodedLpOutput];
    const simulationOutput = defaultAbiCoder.encode([`bytes[]`], [array]);
    mockSigner.setFunctionOutputData(simulationOutput);

    const result = await simulateEditLp({
      positionId: positionId,
      signer: mockSigner,
      notional: 10000,
      margin: 10,
    });

    encodeMock.verify();
    getPositionInfoMock.verify();
    encodeMock.restore();
    getPositionInfoMock.restore();

    assert.equal(result.marginRequirement, 3);
    assert.equal(result.maxMarginWithdrawable, 27);
    assert.equal(result.fee, 0.00002);
  });
});
