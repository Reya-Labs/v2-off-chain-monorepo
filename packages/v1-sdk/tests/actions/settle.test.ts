import { BigNumber } from "ethers";
import {getPeripheryContract} from "../../src/common/contract-generators";

jest.mock(
  '../../../src/common/contract-generators/getPeripheryContract',
  () => ({
    getPeripheryContract: jest.fn(() => {}),
  }),
);



describe('settle', () => {
  it("periphery function executed with expected args", async () => {
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
  })
})