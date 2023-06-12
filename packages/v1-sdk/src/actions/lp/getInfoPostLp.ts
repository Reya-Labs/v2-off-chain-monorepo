import { BigNumber, Contract, providers, Signer } from 'ethers';
import { LpPeripheryParams } from '../types';
import { estimateLpGasUnits } from './estimateLpGasUnits';
import { convertGasUnitsToNativeTokenUnits } from '../../common';

export type InfoPostLp = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX' | 'USDCf';
  };
};

export type GetInfoPostLpArgs = {
  peripheryContract: Contract;
  marginEngineContract: Contract;
  walletAddress: string;
  underlyingTokenDecimals: number;
  lpPeripheryParams: LpPeripheryParams;
};

export const getInfoPostLp = async ({
  peripheryContract,
  marginEngineContract,
  walletAddress,
  underlyingTokenDecimals,
  lpPeripheryParams,
}: GetInfoPostLpArgs): Promise<InfoPostLp> => {
  // todo: the periphery contract expected to have signer check
  const marginRequirement: number = await getMarginRequirementPostLp({
    peripheryContract,
    lpPeripheryParams,
    underlyingTokenDecimals,
  });

  const maxMarginWithdrawable: number = await getMaxMarginWithdrawablePostLp({
    marginEngineContract,
    walletAddress,
    marginRequirement,
    tickLower: lpPeripheryParams.tickLower,
    tickUpper: lpPeripheryParams.tickUpper,
    underlyingTokenDecimals,
  });

  // todo: test to number conversion does not overflow
  const lpGasUnits = (
    await estimateLpGasUnits(peripheryContract, lpPeripheryParams)
  ).toNumber();

  const gasFeeNativeToken = await convertGasUnitsToNativeTokenUnits(
    peripheryContract.provider,
    lpGasUnits,
  );
};
