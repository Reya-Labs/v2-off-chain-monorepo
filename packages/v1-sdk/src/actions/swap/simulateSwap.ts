import { SwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { BigNumber, ethers, providers, utils } from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import getDummyWallet from '../../common/wallet/getDummyWallet';
import { getInfoPostSwap, InfoPostSwap } from './getInfoPostSwap';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';

export const simulateSwap = async ({
  ammId,
  notional,
  margin,
  fixedRateLimit,
  signer,
}: SwapArgs): Promise<InfoPostSwap> => {
  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }
  const chainId: number = await signer.getChainId();

  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);

  const signerAddress: string = await signer.getAddress();

  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams({
    margin,
    isFT: notional < 0,
    notional,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const swapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  if (ammInfo.isEth && margin > 0) {
    swapPeripheryTempOverrides.value = utils.parseEther(
      margin.toFixed(18).toString(),
    );
  }

  const infoPostSwap = await getInfoPostSwap({
    peripheryContract,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    provider: signer.provider,
    chainId,
    signer,
    swapPeripheryParams,
  });

  return infoPostSwap;
};
