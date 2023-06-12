/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ethers } from 'ethers';

import { generateMarginEngineContract } from '../contract-services/generateMarginEngineContract';
import { generateRateOracleContract } from '../contract-services/generateRateOracleContract';
import { getProvider } from '../provider/getProvider';

const getAaveLendingLiquidityIndex = async (
  provider: ethers.providers.Provider,
  rateOracleId: string,
  blockTag?: number,
): Promise<number> => {
  const rateOracleContract = generateRateOracleContract(rateOracleId, provider);

  const aaveLendingPoolABI = [
    `function getReserveNormalizedIncome(address underlyingAsset) external view returns (uint256)`,
  ];
  const aaveLendingPoolAddress =
    (await rateOracleContract.aaveLendingPool()) as string;

  const aaveLendingPoolContract = new ethers.Contract(
    aaveLendingPoolAddress,
    aaveLendingPoolABI,
    provider,
  );

  const token = (await rateOracleContract.underlying()) as string;

  const liquidityIndexRay =
    (await aaveLendingPoolContract.getReserveNormalizedIncome(token, {
      blockTag,
    })) as ethers.BigNumber;

  const liquidityIndex = Number(
    ethers.utils.formatUnits(liquidityIndexRay, 27),
  );

  return liquidityIndex;
};

const getCompoundLendingLiquidityIndex = async (
  provider: ethers.providers.Provider,
  rateOracleId: string,
  blockTag?: number,
): Promise<number> => {
  const rateOracleContract = generateRateOracleContract(rateOracleId, provider);

  const cTokenABI = [
    `function exchangeRateStored() external view returns (uint256)`,
  ];
  const cTokenAddress = (await rateOracleContract.ctoken()) as string;

  const cTokenContract = new ethers.Contract(
    cTokenAddress,
    cTokenABI,
    provider,
  );

  const liquidityIndexRay = (await cTokenContract.exchangeRateStored({
    blockTag,
  })) as ethers.BigNumber;

  // todo: 28 is for DAI, generalise for all tokens
  const liquidityIndex = Number(
    ethers.utils.formatUnits(liquidityIndexRay, 28),
  );

  return liquidityIndex;
};

const getLiquidityIndexOneTime = async (
  chainId: number,
  provider: ethers.providers.Provider,
  marginEngineAddress: string,
  blockTag?: number,
): Promise<number> => {
  const marginEngineContract = generateMarginEngineContract(
    marginEngineAddress,
    provider,
  );
  const rateOracleId = (await marginEngineContract.rateOracle({
    blockTag,
  })) as string;

  // Check for inconsistent rate oracles
  if (
    chainId === 1 &&
    rateOracleId.toLowerCase() ===
      '0x9f30Ec6903F1728ca250f48f664e48c3f15038eD'.toLowerCase()
  ) {
    return getAaveLendingLiquidityIndex(provider, rateOracleId, blockTag);
  }

  if (
    chainId === 1 &&
    rateOracleId.toLowerCase() ===
      '0x65F5139977C608C6C2640c088D7fD07fA17A0614'.toLowerCase()
  ) {
    return getAaveLendingLiquidityIndex(provider, rateOracleId, blockTag);
  }

  if (
    chainId === 1 &&
    rateOracleId.toLowerCase() ===
      '0x919674d599D8df8dd9E7Ebaabfc2881089C5D91C'.toLowerCase()
  ) {
    return getCompoundLendingLiquidityIndex(provider, rateOracleId, blockTag);
  }
  //

  const rateOracleContract = generateRateOracleContract(rateOracleId, provider);

  const liquidityIndexRay = (await rateOracleContract.getCurrentRateInRay({
    blockTag,
  })) as ethers.BigNumber;

  const liquidityIndex = Number(
    ethers.utils.formatUnits(liquidityIndexRay, 27),
  );

  return liquidityIndex;
};

export const getLiquidityIndex = async (
  chainId: number,
  marginEngineAddress: string,
  blockTag?: number,
): Promise<number> => {
  const provider = getProvider(chainId);

  const liquidityIndex = await getLiquidityIndexOneTime(
    chainId,
    provider,
    marginEngineAddress,
    blockTag,
  );

  return liquidityIndex;
};
