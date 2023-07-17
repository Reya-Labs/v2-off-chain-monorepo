import { BigNumber, Signer, providers } from 'ethers';
import { getCoreContract } from './contract';
import { Address } from '../../address';
import { getTokenDetails } from '../../token';

export type GetV2MarginRequirementsArgs = {
  chainId: number;
  subject: providers.JsonRpcProvider | Signer;
  accountId: string;
  collateralType: Address;
};

export type GetV2MarginRequirementsOutput = {
  liquidationThreshold: number;
  safetyThreshold: number;
};

export const getV2MarginRequirements = async ({
  chainId,
  subject,
  accountId,
  collateralType,
}: GetV2MarginRequirementsArgs): Promise<GetV2MarginRequirementsOutput> => {
  // Get core contract
  const contract = getCoreContract(chainId, subject);

  const result = await contract.isLiquidatable(accountId, collateralType);

  // Decode result
  const initialMarginRequirement = BigNumber.from(
    result.initialMarginRequirement,
  );

  const liquidationMarginRequirement = BigNumber.from(
    result.liquidationMarginRequirement,
  );

  const highestUnrealizedLoss = BigNumber.from(result.highestUnrealizedLoss);

  // Get token descaler
  const { tokenDescaler } = getTokenDetails(collateralType);

  // Calculate liquidation and safety thresholds and descale
  const liquidationThreshold = tokenDescaler(
    liquidationMarginRequirement.add(highestUnrealizedLoss),
  );

  const safetyThreshold = tokenDescaler(
    initialMarginRequirement.add(highestUnrealizedLoss),
  );

  // Return result
  return {
    liquidationThreshold,
    safetyThreshold,
  };
};
