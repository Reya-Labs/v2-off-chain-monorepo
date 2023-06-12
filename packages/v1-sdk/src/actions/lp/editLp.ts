import { EditLpArgs, LpPeripheryParams } from '../types';
import { ContractReceipt, ethers } from 'ethers';
import {
  decodePositionId,
  DecodedPosition,
} from '../../common/api/position/decodePositionId';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { getPeripheryContract } from '../../common/contract-generators';

export const editLp = async ({
  positionId,
  notional,
  margin,
  signer,
}: EditLpArgs): Promise<ContractReceipt> => {
  const decodedPosition: DecodedPosition = decodePositionId(positionId);
  const peripheryAddress =
    PERIPHERY_ADDRESS_BY_CHAIN_ID[decodedPosition.chainId];
  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );
  const lpPeripheryParams: LpPeripheryParams = {
    marginEngineAddress,
    isMint: notional > 0,
    tickLower: decodedPosition.tickLower,
    tickUpper: decodedPosition.tickUpper,
    marginDelta: margin,
    notional: notional,
  };
};
