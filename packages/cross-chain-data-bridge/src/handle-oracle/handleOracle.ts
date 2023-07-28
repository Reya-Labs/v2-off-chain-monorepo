import {
  Address,
  getRateOracleContract,
  exponentialBackoff,
} from '@voltz-protocol/commons-v2';
import { getMockXRateOracleContract } from '../smart-contracts/mockXRateOracle';
import { getProvider } from '../services/getProvider';
import { getSigner } from '../services/getSigner';
import { getOperatorPrivateKey } from '../services/envVars';
import { log } from '../logging/log';

export const handleOracle = async (chainId: number, oracleAddress: Address) => {
  const provider = getProvider(chainId);
  const signer = getSigner(getOperatorPrivateKey(), provider);
  const mockXOracleContract = getMockXRateOracleContract(signer, oracleAddress);

  try {
    const xChainId = await exponentialBackoff(() =>
      mockXOracleContract.xChainId(),
    );
    const xRateOracleAddress = await exponentialBackoff(() =>
      mockXOracleContract.xRateOracleAddress(),
    );

    const xProvider = getProvider(xChainId.toNumber());
    const xOracleContract = getRateOracleContract(
      xProvider,
      xRateOracleAddress,
    );
    const hasState = await xOracleContract.hasState();
    if (hasState) {
      const earliestStateUpdate: number = (
        await xOracleContract.earliestStateUpdate()
      ).toNumber();
      if (earliestStateUpdate * 1000 <= Date.now()) {
        const tx = await xOracleContract.updateState();
        await tx.wait();
      }
    }

    const xLiquidityIndexE18 = await exponentialBackoff(() =>
      xOracleContract.getCurrentIndex(),
    );

    const tx = await mockXOracleContract.mockIndex(
      xLiquidityIndexE18.toString(),
    );
    await tx.wait();
    log(
      `X-mock successful: ${xChainId} -> ${chainId}, ${xRateOracleAddress} -> ${oracleAddress}`,
    );
  } catch (e) {
    log(
      `Rate oracle ${oracleAddress} (chain id ${chainId}) is not a mock x rate oracle.`,
    );
  }
};
