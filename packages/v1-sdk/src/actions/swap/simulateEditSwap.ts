import { EditSwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { BigNumber, ethers, utils } from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { getInfoPostSwap } from './getInfoPostSwap';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';
import { InfoPostSwap } from './getInfoPostSwap';

export const simulateEditSwap = async ({
  positionId,
  notional,
  margin,
  fixedRateLimit,
  signer,
}: EditSwapArgs): Promise<InfoPostSwap> => {
  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }
  const chainId: number = await signer.getChainId();

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams({
    margin,
    isFT: notional > 0,
    notional,
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    underlyingTokenDecimals: positionInfo.ammUnderlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const swapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  if (positionInfo.isEth && margin > 0) {
    swapPeripheryTempOverrides.value = utils.parseEther(
      margin.toFixed(18).toString(),
    );
  }

  const infoPostSwap = await getInfoPostSwap({
    peripheryContract,
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    underlyingTokenDecimals: positionInfo.ammUnderlyingTokenDecimals,
    provider: signer.provider,
    chainId,
    signer,
    swapPeripheryParams,
  });

  return infoPostSwap;
};
