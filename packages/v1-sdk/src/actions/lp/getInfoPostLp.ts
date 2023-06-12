import { BigNumber, Contract, providers, Signer } from 'ethers';
import { SupportedChainId } from '../../common/types';
import { LpPeripheryParams } from '../types';

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
  });

  const maxMarginWithdrawable: number = await getMaxMarginWithdrawablePostLp({
    marginEngineContract,
    walletAddress,
    marginRequirement,
    tickLower: lpPeripheryParams.tickLower,
    tickUpper: lpPeripheryParams.tickUpper,
  });
};
