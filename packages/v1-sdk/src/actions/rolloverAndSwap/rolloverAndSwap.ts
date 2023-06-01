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
import { handleSwapErrors } from '../swap/handleSwapErrors';
import { getPeripheryContract } from '../../common/contract-generators';
import { getRolloverAndSwapPeripheryParams } from './getRolloverAndSwapPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateRolloverAndSwapGasUnits } from './estimateRolloverAndSwapGasUnits';

export const rolloverAndSwap = async ({
  isFT,
  notional,
  margin,
  fixedRateLimit,
  fixedLow,
  fixedHigh,
  underlyingTokenAddress,
  underlyingTokenDecimals,
  tickSpacing,
  chainId,
  peripheryAddress,
  marginEngineAddress,
  provider,
  signer,
  isEth,
  maturedMarginEngineAddress,
  maturedPositionOwnerAddress,
  maturedPositionSettlementBalance,
  maturedPositionTickLower,
  maturedPositionTickUpper,
}: RolloverAndSwapArgs): Promise<ContractReceipt> => {
  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress,
  });

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const rolloverAndSwapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  let marginDelta = margin;
  if (isEth && maturedPositionSettlementBalance < margin) {
    marginDelta = maturedPositionSettlementBalance;
    rolloverAndSwapPeripheryTempOverrides.value = BigNumber.from(
      margin - maturedPositionSettlementBalance,
    );
  }

  const rolloverAndSwapPeripheryParams: RolloverAndSwapPeripheryParams =
    getRolloverAndSwapPeripheryParams({
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
    });

  const estimatedGasUnits: BigNumber = await estimateRolloverAndSwapGasUnits(
    peripheryContract,
    rolloverAndSwapPeripheryParams,
    rolloverAndSwapPeripheryTempOverrides,
  );

  rolloverAndSwapPeripheryTempOverrides.gasLimit =
    getGasBuffer(estimatedGasUnits);

  const rolloverAndSwapTransaction: ContractTransaction =
    await peripheryContract
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
