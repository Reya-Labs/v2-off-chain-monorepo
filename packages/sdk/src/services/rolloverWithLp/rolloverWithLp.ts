import { RolloverWithLpArgs } from './types';
import { ContractReceipt } from 'ethers';
import { ZERO_BN } from '../../utils/constants';
import { InfoPostLp } from '../lp';

export async function rolloverWithLp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: RolloverWithLpArgs,
): Promise<ContractReceipt> {
  return Promise.resolve({
    to: '',
    from: '',
    contractAddress: '',
    transactionIndex: 0,
    gasUsed: ZERO_BN,
    logsBloom: '',
    blockHash: '',
    transactionHash: '',
    logs: [],
    blockNumber: 0,
    confirmations: 0,
    cumulativeGasUsed: ZERO_BN,
    effectiveGasPrice: ZERO_BN,
    byzantium: true,
    type: 0,
  });
}

export async function simulateRolloverWithLp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: RolloverWithLpArgs,
): Promise<InfoPostLp> {
  return {
    marginRequirement: 0,
    maxMarginWithdrawable: 0,
    fee: 0,
    gasFee: {
      value: 0,
      token: 'ETH',
    },
  };
}
