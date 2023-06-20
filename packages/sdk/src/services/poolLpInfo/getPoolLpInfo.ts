import { BigNumber } from 'ethers';
import { simulateTx } from '../executeTransaction';
import { createLpParams, decodeLpOutput, getLpTxData } from '../lp';
import {
  GetLpMaxLeverageArgs,
  GetPoolLpInfoArgs,
  GetPoolLpInfoResults,
} from './types';
import { getDummyWallet } from '../../utils/getDummyWallet';
import { descale, scale } from '../../utils/helpers';

export const getPoolLpInfo = async ({
  ammId,
  fixedHigh,
  fixedLow,
  provider,
}: GetPoolLpInfoArgs): Promise<GetPoolLpInfoResults> => {
  const mockSigner = getDummyWallet().connect(provider);

  try {
    const maxLeverage = await getLpMaxLeverage({
      ammId,
      fixedLow,
      fixedHigh,
      mockSigner: mockSigner,
    });

    return {
      maxLeverage,
    };
  } catch (e) {
    return {
      maxLeverage: -1,
    };
  }
};

async function getLpMaxLeverage({
  ammId,
  fixedLow,
  fixedHigh,
  mockSigner,
}: GetLpMaxLeverageArgs): Promise<number> {
  const params = await createLpParams({
    ammId,
    signer: mockSigner,
    notional: 1,
    margin: 0,
    fixedLow,
    fixedHigh,
  });

  const { data, value, chainId } = await getLpTxData(params);
  const bytesOutput = (await simulateTx(mockSigner, data, value, chainId))
    .bytesOutput;

  const im = decodeLpOutput(bytesOutput).im;

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
}
