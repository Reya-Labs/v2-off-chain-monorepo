import { RolloverAndLpArgs } from './types';
import { ContractReceipt } from 'ethers';
import { ZERO_BN } from '../../utils/constants';
import { InfoPostLp } from '../lp';

export async function rolloverAndLp(
  args: RolloverAndLpArgs,
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

export async function simulateRolloverAndLp(
  args: RolloverAndLpArgs,
): Promise<InfoPostLp> {
  return Promise.resolve({
    marginRequirement: 0,
    maxMarginWithdrawable: 0,
    fee: 0,
    gasFee: {
      value: 0,
      token: 'ETH',
    },
  });
}
