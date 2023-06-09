import { LpArgs, LpPeripheryParams } from '../types/actionArgTypes';
import { BigNumber, ContractReceipt, ethers, utils } from 'ethers';
import { handleLpErrors } from './handleLpErrors';
import { getPeripheryContract } from '../../common/contract-generators';
import { getLpPeripheryParams } from './getLpPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateLpGasUnits } from './estimateLpGasUnits';
import {
  DEFAULT_TICK_SPACING,
  NUMBER_OF_DECIMALS_ETHER,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';

export const lp = async ({
  ammId,
  addLiquidity,
  fixedLow,
  fixedHigh,
  notional,
  margin,
  signer,
}: LpArgs): Promise<ContractReceipt> => {
  handleLpErrors({
    notional,
    fixedLow,
    fixedHigh,
  });

  const chainId: number = await signer.getChainId();
  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);
  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const lpPeripheryParams: LpPeripheryParams = getLpPeripheryParams({
    addLiquidity,
    margin,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    tickSpacing,
  });

  const lpPeripheryTempOverrides: {
    value?: ethers.BigNumber;
    gasLimit?: ethers.BigNumber;
  } = {};

  if (ammInfo.isEth && margin > 0) {
    lpPeripheryTempOverrides.value = utils.parseEther(
      margin.toFixed(NUMBER_OF_DECIMALS_ETHER).toString(),
    );
  }

  const estimatedGasUnits: BigNumber = await estimateLpGasUnits(
    peripheryContract,
    lpPeripheryParams,
    lpPeripheryTempOverrides,
  );

  lpPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const tx: ethers.ContractTransaction = await peripheryContract
    .mintOrBurn(lpPeripheryParams, lpPeripheryTempOverrides)
    .catch(() => {
      throw new Error('LP Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await tx.wait();

  return receipt;
};
