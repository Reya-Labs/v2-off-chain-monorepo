import {
  DecodedPosition,
  decodePositionId,
} from '../../common/api/position/decodePositionId';

import { EditLpArgs, LpPeripheryParams } from '../types';
import { getInfoPostLp, InfoPostLp } from './getInfoPostLp';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { ethers } from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators';
import { getMarginEngineContract } from '../../common/contract-generators';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';

export const simulateEditLp = async ({
  positionId,
  notional,
  margin,
  signer,
}: EditLpArgs): Promise<InfoPostLp> => {
  const chainId: number = await signer.getChainId();
  const decodedPosition: DecodedPosition = decodePositionId(positionId);
  const positionInfo: PositionInfo = await getPositionInfo(positionId);
  const walletAddress: string = await signer.getAddress();

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const marginEngineContract: ethers.Contract = getMarginEngineContract(
    positionInfo.ammMarginEngineAddress,
    signer,
  );

  const lpPeripheryParams: LpPeripheryParams = {
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    isMint: notional > 0,
    tickLower: decodedPosition.tickLower,
    tickUpper: decodedPosition.tickUpper,
    marginDelta: margin,
    notional: notional,
  };

  const infoPostLp = await getInfoPostLp({
    peripheryContract,
    marginEngineContract,
    walletAddress,
    underlyingTokenDecimals: positionInfo.ammUnderlyingTokenDecimals,
    lpPeripheryParams,
  });

  return infoPostLp;
};
