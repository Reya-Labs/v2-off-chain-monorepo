import { BigNumber } from 'ethers';
import { Transaction, simulateTxExpectError } from '../executeTransaction';
import { encodeLp } from './encode';
import { CompleteLpDetails, InfoPostLp } from './types';
import {
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
  descale,
} from '@voltz-protocol/commons-v2';
import { decodeLp } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { getFee } from '../../utils/getFee';

export const commonSimulateLp = async (
  params: CompleteLpDetails,
): Promise<InfoPostLp> => {
  const { calldata: data, value, lpActionPosition } = encodeLp(params);

  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  let isError = false;

  try {
    const res = await simulateTxExpectError(
      params.signer,
      data,
      value,
      params.chainId,
    );

    txData = res.txData;
    bytesOutput = res.bytesOutput;
    isError = res.isError;
  } catch (e) {
    return {
      gasFee: {
        value: -1,
        token: 'ETH',
      },
      fee: -1,
      marginRequirement: -1,
      maxMarginWithdrawable: -1,
    };
  }

  let fee = 0;
  let marginRequirement = 0;

  if (isError) {
    marginRequirement = descale(params.quoteTokenDecimals)(
      decodeImFromError(bytesOutput).marginRequirement,
    );
    fee = getFee(params.userNotional, params.fee, params.maturityTimestamp);
  } else {
    const output = decodeLp(bytesOutput[lpActionPosition]);
    marginRequirement = descale(params.quoteTokenDecimals)(output.im);
    fee = descale(params.quoteTokenDecimals)(output.fee);
  }

  const price = await convertGasUnitsToNativeTokenUnits(
    params.signer,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  const maxMarginWithdrawable = Math.max(
    0,
    params.accountMargin - marginRequirement,
  );

  const result = {
    gasFee,
    fee,
    marginRequirement,
    maxMarginWithdrawable,
  };

  return result;
};
