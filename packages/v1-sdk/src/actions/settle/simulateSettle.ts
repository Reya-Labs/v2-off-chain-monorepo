import { SettleArgs, SettlePeripheryParams } from '../types';
import { BigNumber, ethers, providers } from 'ethers';
import { SettleSimulationResults } from './types';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { getPeripheryContract } from '../../common/contract-generators';
import { estimateSettleGasUnits } from './estimateSettleGasUnits';
import {
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
} from '../../common';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';

export const simulateSettle = async ({
  positionId,
  signer,
}: SettleArgs): Promise<SettleSimulationResults> => {
  // todo: add sentry

  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  // todo: decode
  const chainId: number = await signer.getChainId();

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const positionOwnerAddress: string = await signer.getAddress();

  const provider: providers.Provider = signer.provider;

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const settlePeripheryParams: SettlePeripheryParams = {
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    positionOwnerAddress: positionOwnerAddress,
    tickLower: positionInfo.positionTickLower,
    tickUpper: positionInfo.positionTickUpper,
  };

  const estimatedGasUnits: BigNumber = await estimateSettleGasUnits(
    peripheryContract,
    settlePeripheryParams,
  );

  const estmatedGasCostInNativeToken = await convertGasUnitsToNativeTokenUnits(
    provider,
    estimatedGasUnits.toNumber(),
  );

  return {
    gasFee: {
      value: estmatedGasCostInNativeToken,
      token: await getNativeGasToken(provider),
    },
  };
};
