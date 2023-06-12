/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BigNumber, utils } from 'ethers';

import { generateRateOracleContract } from '../contract-services/generateRateOracleContract';
import { getProvider } from '../provider/getProvider';

export const getVariableFactor = (
  chainId: number,
  rateOracleId: string,
): ((fromInMS: number, toInMS: number) => Promise<number>) => {
  const provider = getProvider(chainId);
  const rateOracleContract = generateRateOracleContract(rateOracleId, provider);

  const func = async (fromInMS: number, toInMS: number): Promise<number> => {
    const fromWad = utils.parseUnits(fromInMS.toString(), 15);
    const toWad = utils.parseUnits(toInMS.toString(), 15);

    const variableFactorWad: BigNumber =
      await rateOracleContract.callStatic.variableFactor(fromWad, toWad);
    const variableFactor = Number(utils.formatUnits(variableFactorWad, 18));

    return variableFactor;
  };

  return func;
};
