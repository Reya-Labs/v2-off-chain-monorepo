import { ApprovePeripheryArgs } from './types';
import { getGasBuffer } from '../../utils/txHelpers';
import { BigNumber } from 'ethers';
import {
  getAddress,
  getERC20Allowance,
  getERC20TokenContract,
} from '@voltz-protocol/commons-v2';
import { getPool } from '@voltz-protocol/api-sdk-v2';

export const approvePeriphery = async ({
  ammId,
  signer,
}: ApprovePeripheryArgs): Promise<number> => {
  const chainId = await signer.getChainId();
  const poolInfo = await getPool({ poolId: ammId });

  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  const tokenContract = getERC20TokenContract(
    poolInfo.underlyingToken.address,
    signer,
  );

  const peripheryAddress = getAddress(chainId, 'periphery');

  const maxUint256Bn = BigNumber.from(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  );

  let estimatedGas;
  try {
    estimatedGas = await tokenContract.estimateGas.approve(
      peripheryAddress,
      maxUint256Bn,
    );
  } catch (error) {
    console.warn(
      `Could not increase periphery allowance (${
        poolInfo.underlyingToken.address
      }, ${maxUint256Bn.toString()})`,
    );
    throw new Error(
      `Unable to approve. If your existing allowance is non-zero but lower than needed, some tokens like USDT require you to call approve("${peripheryAddress}", 0) before you can increase the allowance.`,
    );
  }

  const approvalTransaction = await tokenContract
    .approve(peripheryAddress, maxUint256Bn, {
      gasLimit: getGasBuffer(estimatedGas),
    })
    .catch((error: any) => {
      console.warn('Transaction Confirmation Error');
      console.error(error);
      throw new Error('Transaction Confirmation Error');
    });

  try {
    await approvalTransaction.wait();
  } catch (error) {
    console.warn('Token approval failed');
    throw new Error('Token approval failed');
  }

  try {
    const allowance = await getERC20Allowance({
      walletAddress: await signer.getAddress(),
      tokenAddress: poolInfo.underlyingToken.address,
      spenderAddress: peripheryAddress,
      subject: signer,
    });

    return allowance;
  } catch (error) {
    console.warn('Fetching allowance failed');
  }

  return 0;
};
