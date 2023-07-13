import { Contract } from 'ethers';
import { LpPeripheryParams } from '../types';
import { estimateLpGasUnits } from './estimateLpGasUnits';
import { getMarginRequirementPostLp } from './getMarginRequirementPostLp';
import { GetMarginRequirementPostLpResults } from './getMarginRequirementPostLp';
import {
  convertGasUnitsToNativeTokenUnits,
  exponentialBackoff,
  getNativeGasToken,
} from '@voltz-protocol/commons-v2';

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
  const marginRequirementPostLpResults: GetMarginRequirementPostLpResults =
    await getMarginRequirementPostLp({
      peripheryContract,
      marginEngineContract,
      lpPeripheryParams,
      underlyingTokenDecimals,
      walletAddress,
    });

  // todo: test to number conversion does not overflow
  const lpGasUnits = (
    await estimateLpGasUnits(peripheryContract, lpPeripheryParams)
  ).toNumber();

  const gasFeeNativeToken = await convertGasUnitsToNativeTokenUnits(
    peripheryContract.provider,
    lpGasUnits,
  );

  const chainId = (
    await exponentialBackoff(() => peripheryContract.provider.getNetwork())
  ).chainId;

  return {
    marginRequirement: marginRequirementPostLpResults.additionalMargin,
    maxMarginWithdrawable: marginRequirementPostLpResults.maxMarginWithdrawable,
    gasFee: {
      value: gasFeeNativeToken,
      token: getNativeGasToken(chainId),
    },
  };
};
