import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
} from 'ethers';
import {
  RolloverAndSwapArgs,
  RolloverAndSwapPeripheryParams,
} from '../types/actionArgTypes';
import { getPeripheryContract } from '../../common/contract-generators';
import { getRolloverAndSwapPeripheryParams } from './getRolloverAndSwapPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateRolloverAndSwapGasUnits } from './estimateRolloverAndSwapGasUnits';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';

export const rolloverAndSwap = async ({
  maturedPositionId,
  ammId,
  isFT,
  notional,
  margin,
  fixedRateLimit,
  signer,
}: RolloverAndSwapArgs): Promise<ContractReceipt> => {
  const maturedPositionInfo: PositionInfo = await getPositionInfo(
    maturedPositionId,
  );

  const peripheryAddress =
    PERIPHERY_ADDRESS_BY_CHAIN_ID[maturedPositionInfo.chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const rolloverAndSwapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  // todo: make sure below logic is correct
  const maturedPositionSettlementBalance: number =
    maturedPositionInfo.margin + maturedPositionInfo.realizedPNLTotal;

  let marginDelta = margin;
  if (maturedPositionInfo.isEth && maturedPositionSettlementBalance < margin) {
    marginDelta = maturedPositionSettlementBalance;
    rolloverAndSwapPeripheryTempOverrides.value = BigNumber.from(
      margin - maturedPositionSettlementBalance,
    );
  }

  const rolloverAndSwapPeripheryParams: RolloverAndSwapPeripheryParams = getRolloverAndSwapPeripheryParams(
    {
      margin: marginDelta,
      isFT,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      fixedRateLimit,
      tickSpacing,
      maturedMarginEngineAddress,
      maturedPositionOwnerAddress,
      maturedPositionSettlementBalance,
      maturedPositionTickLower,
      maturedPositionTickUpper,
    },
  );

  const estimatedGasUnits: BigNumber = await estimateRolloverAndSwapGasUnits(
    peripheryContract,
    rolloverAndSwapPeripheryParams,
    rolloverAndSwapPeripheryTempOverrides,
  );

  rolloverAndSwapPeripheryTempOverrides.gasLimit = getGasBuffer(
    estimatedGasUnits,
  );

  const rolloverAndSwapTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .rolloverWithSwap(
      rolloverAndSwapPeripheryParams,
      rolloverAndSwapPeripheryTempOverrides,
    )
    .catch(() => {
      throw new Error('RolloverAndSwap Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await rolloverAndSwapTransaction.wait();

  return receipt;
};
