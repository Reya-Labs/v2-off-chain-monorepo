import { SettleArgs, SettlePeripheryParams } from '../types/actionArgTypes';
import { BigNumber, ContractReceipt, ethers, providers } from 'ethers';
import { SettleSimulationResults } from './types';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { getPeripheryContract } from '../../common/contract-generators';
import { estimateSettleGasUnits } from './estimateSettleGasUnits';
import { getNativeGasToken } from '../../common/gas/getNativeGasToken';
import { convertGasUnitsToNativeTokenUnits } from '../../common/gas/convertGasUnitsToNativeTokenUnits';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';

export const simulateSettle = async ({
  positionId,
  signer,
}: SettleArgs): Promise<SettleSimulationResults> => {
  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  const chainId: number = await signer.getChainId();

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const positionOwnerAddress: string = await signer.getAddress();

  const provider: providers.Provider = signer.provider;

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const settlePeripheryParams: SettlePeripheryParams = {
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    positionOwnerAddress: positionOwnerAddress,
    tickLower: positionInfo.positionTickLower,
    tickUpper: positionInfo.positionTickUpper,
  };

  const settlePeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  const estimatedGasUnits: BigNumber = await estimateSettleGasUnits(
    peripheryContract,
    settlePeripheryParams,
    settlePeripheryTempOverrides,
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
