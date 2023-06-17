import { getPoolInfo } from '../../gateway/getPoolInfo';
import { ApprovePeripheryArgs } from './types';
import MaxUint256Bn, {
  getERC20TokenContract,
} from '@voltz-protocol/sdk-v1-stateless';
import { PERIPHERY_ADDRESS } from '../../utils/configuration';
import { getGasBuffer } from '../../utils/txHelpers';

export const approvePeriphery = async ({
  ammId,
  signer,
}: ApprovePeripheryArgs): Promise<void> => {
  const chainId = await signer.getChainId();

  const poolInfo = await getPoolInfo(ammId);

  const tokenContract = getERC20TokenContract(
    poolInfo.quoteToken.address,
    signer,
  );

  const peripheryAddress = PERIPHERY_ADDRESS(chainId);

  let estimatedGas;
  try {
    estimatedGas = await tokenContract.estimateGas.approve(
      peripheryAddress,
      MaxUint256Bn,
    );
  } catch (error) {
    console.warn(
      `Could not increase periphery allowance (${
        poolInfo.quoteToken.address
      }, ${MaxUint256Bn.toString()})`,
    );
    throw new Error(
      `Unable to approve. If your existing allowance is non-zero but lower than needed, some tokens like USDT require you to call approve("${peripheryAddress}", 0) before you can increase the allowance.`,
    );
  }

  const approvalTransaction = await tokenContract
    .approve(peripheryAddress, MaxUint256Bn, {
      gasLimit: getGasBuffer(estimatedGas),
    })
    .catch((error: any) => {
      console.warn('Transaction Confirmation Error');
      throw new Error('Transaction Confirmation Error');
    });

  try {
    await approvalTransaction.wait();
  } catch (error) {
    console.warn('Token approval failed');
    throw new Error('Token approval failed');
  }
};
