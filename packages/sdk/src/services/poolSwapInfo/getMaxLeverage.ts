import { BigNumber } from 'ethers';
import { getSwapTxData } from '../swap';
import { simulateTx, simulateTxExpectError } from '../executeTransaction';
import { MINUS_ONE_BN, ONE_BN, ZERO_BN } from '../../utils/constants';
import { GetMaxLeverageArgs } from './types';
import { descale, scale } from '../../utils/helpers';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { decodeSwap } from '../../utils/decodeOutput';

export const getMaxLeverage = async ({
  isFT,
  chainId,
  params,
}: GetMaxLeverageArgs): Promise<number> => {
  const { data, value } = await getSwapTxData({
    ...params,
    baseAmount: isFT ? ONE_BN : MINUS_ONE_BN,
    margin: ZERO_BN,
  });

  const { bytesOutput, isError } = await simulateTxExpectError(
    params.owner,
    data,
    value,
    chainId,
  );

  const im = isError
    ? decodeImFromError(bytesOutput).marginRequirement
    : decodeSwap(bytesOutput, true, false, false, true).im;

  if (im.gt(0)) {
    // should always happen, since we connect with dummy account
    const maxLeverage: BigNumber = BigNumber.from(
      scale(params.quoteTokenDecimals)(1),
    )
      .mul(BigNumber.from(10).pow(params.quoteTokenDecimals))
      .div(im);

    return Math.floor(descale(params.quoteTokenDecimals)(maxLeverage));
  }

  return 0;
};
