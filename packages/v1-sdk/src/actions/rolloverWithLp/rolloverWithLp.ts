import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
} from 'ethers';
import {
  RolloverAndLpArgs,
  RolloverAndLpPeripheryParams,
} from '../types/actionArgTypes';
import { handleLpErrors } from '../lp/handleLpErrors';
import { getPeripheryContract } from '../../common/contract-generators';
import { getRolloverWithLpPeripheryParams } from './getRolloverWithLpPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateRolloverWithLpGasUnits } from './estimateRolloverWithLpGasUnits';

export const rolloverWithLp = async ({
  addLiquidity,
  fixedLow,
  fixedHigh,
  notional,
  margin,
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
}: RolloverAndLpArgs): Promise<ContractReceipt> => {
  handleLpErrors({
    notional,
    fixedLow,
    fixedHigh,
  });

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const rolloverAndLpPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  let marginDelta = margin;
  if (isEth && maturedPositionSettlementBalance < margin) {
    marginDelta = maturedPositionSettlementBalance;
    rolloverAndLpPeripheryTempOverrides.value = BigNumber.from(
      margin - maturedPositionSettlementBalance,
    );
  }

  const rolloverAndLpPeripheryParams: RolloverAndLpPeripheryParams = getRolloverWithLpPeripheryParams(
    {
      addLiquidity,
      margin: marginDelta,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      tickSpacing,
      maturedMarginEngineAddress,
      maturedPositionOwnerAddress,
      maturedPositionSettlementBalance,
      maturedPositionTickLower,
      maturedPositionTickUpper,
    },
  );

  const estimatedGasUnits: BigNumber = await estimateRolloverWithLpGasUnits(
    peripheryContract,
    rolloverAndLpPeripheryParams,
    rolloverAndLpPeripheryTempOverrides,
  );

  rolloverAndLpPeripheryTempOverrides.gasLimit = getGasBuffer(
    estimatedGasUnits,
  );

  const rolloverAndLpTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .rolloverAndLp(
      rolloverAndLpPeripheryParams,
      rolloverAndLpPeripheryTempOverrides,
    )
    .catch(() => {
      throw new Error('RolloverAndLp Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await rolloverAndLpTransaction.wait();

  return receipt;
};
