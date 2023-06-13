import { LpArgs, LpPeripheryParams } from '../types';
import { getInfoPostLp, InfoPostLp } from './getInfoPostLp';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { ethers } from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators';
import { getMarginEngineContract } from '../../common/contract-generators';
import { getLpPeripheryParams } from './getLpPeripheryParams';

export const simulateLp = async ({
  ammId,
  fixedLow,
  fixedHigh,
  notional,
  margin,
  signer,
}: LpArgs): Promise<InfoPostLp> => {
  const chainId: number = await signer.getChainId();
  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);
  const tickSpacing: number = DEFAULT_TICK_SPACING;
  const walletAddress: string = await signer.getAddress();

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const marginEngineContract: ethers.Contract = getMarginEngineContract(
    ammInfo.marginEngineAddress,
    signer,
  );

  const lpPeripheryParams: LpPeripheryParams = getLpPeripheryParams({
    margin,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    tickSpacing,
  });

  const infoPostLp = await getInfoPostLp({
    peripheryContract,
    marginEngineContract,
    walletAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    lpPeripheryParams,
  });

  return infoPostLp;
};
