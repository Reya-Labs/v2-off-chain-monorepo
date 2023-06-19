import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { encodeSettlement } from '../src/services/settle/encode';
import * as encode from '../src/services/settle/encode';
import * as getPositionInfoFile from '../src/gateway/getPositionInfo';
import * as constants from '../src/utils/constants';
import { MockSigner } from './utils/MockSigner';
import { SettleParameters } from '../src/services/settle/types';
import { PoolConfig, PoolInfo, PositionInfo } from '../src/gateway/types';
import { simulateSettle, settle } from '../src/services/settle/settle';
import { scale } from '../src/utils/helpers';

describe('settle', async () => {
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

  it('settle test', async () => {
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

    const settlePeripheryParams: SettleParameters = {
      ...positionInfo,
      owner: mockSigner,
      margin: scale(positionInfo.quoteTokenDecimals)(
        positionInfo.positionMargin,
      ),
    };

    const expectedResult = await encodeSettlement(settlePeripheryParams);

    const getPositionInfoMock = sinon.mock(getPositionInfoFile);
    getPositionInfoMock
      .expects('getPositionInfo')
      .withArgs('1_19083', 1, await mockSigner.getAddress())
      .returns(positionInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeSettlement')
      .withArgs(settlePeripheryParams)
      .returns(expectedResult);

    await settle({
      positionId: '1_19083',
      signer: mockSigner,
    });

    encodeMock.verify();
    getPositionInfoMock.verify();
    encodeMock.restore();
    getPositionInfoMock.restore();
  });

  it('infoPostSettle test', async () => {
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

    const settlePeripheryParams: SettleParameters = {
      ...positionInfo,
      owner: mockSigner,
      margin: scale(positionInfo.quoteTokenDecimals)(
        positionInfo.positionMargin,
      ),
    };

    const expectedResult = await encodeSettlement(settlePeripheryParams);

    const getPositionInfoMock = sinon.mock(getPositionInfoFile);
    getPositionInfoMock
      .expects('getPositionInfo')
      .withArgs('1_19083', 1, await mockSigner.getAddress())
      .returns(positionInfo);

    const encodeMock = sinon.mock(encode);
    encodeMock
      .expects('encodeSettlement')
      .withArgs(settlePeripheryParams)
      .returns(expectedResult);

    const result = await simulateSettle({
      positionId: '1_19083',
      signer: mockSigner,
    });

    encodeMock.verify();
    getPositionInfoMock.verify();
    encodeMock.restore();
    getPositionInfoMock.restore();

    assert.equal(result.gasFee.token, 'ETH');
    assert.equal(result.gasFee.value.toFixed(10), '0.2400000000');
  });
});
