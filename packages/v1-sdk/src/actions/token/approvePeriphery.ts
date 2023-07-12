import { ApprovePeripheryArgs } from '../types/actionArgTypes';
import {
  MaxUint256Bn,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { getSentryTracker } from '../../init';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { getERC20TokenContract } from '@voltz-protocol/commons-v2';

export const approvePeriphery = async ({
  ammId,
  signer,
}: ApprovePeripheryArgs): Promise<void> => {
  const chainId = await signer.getChainId();

  const ammInfo: AMMInfo = await getAmmInfo(ammId);

  const tokenContract = getERC20TokenContract(
    ammInfo.underlyingTokenAddress,
    signer,
  );

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  let estimatedGas;
  try {
    estimatedGas = await tokenContract.estimateGas.approve(
      peripheryAddress,
      MaxUint256Bn,
    );
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage(
      `Could not increase periphery allowance (${
        ammInfo.underlyingTokenAddress
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
      const sentryTracker = getSentryTracker();
      sentryTracker.captureException(error);
      sentryTracker.captureMessage('Transaction Confirmation Error');
      throw new Error('Transaction Confirmation Error');
    });

  try {
    await approvalTransaction.wait();
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage('Token approval failed');
    throw new Error('Token approval failed');
  }
};
