import { BigNumber } from 'ethers';
import { getPeripheryContract } from '../../src/common/contract-generators';
import { jest } from '@jest/globals';

jest.mock('../../src/common/contract-generators', () => ({
  getPeripheryContract: jest.fn(() => {}),
}));

describe.skip('settle', () => {
  it('periphery function executed with expected args', async () => {
    (getPeripheryContract as jest.Mock).mockReturnValueOnce({
      connect: jest.fn(() => {
        console.log('Connecting to periphery contract');
        return {
          settlePositionAndWithdrawMargin: jest.fn(() => {
            return Promise.resolve({
              wait: jest.fn(() => {
                Promise.resolve({});
              }),
            });
          }),
        };
      }),
      estimateGas: {
        settlePositionAndWithdrawMargin: jest.fn(() => {
          return Promise.resolve(BigNumber.from(10000));
        }),
      },
    });
  });
});
