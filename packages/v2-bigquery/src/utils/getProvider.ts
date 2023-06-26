import { providers } from 'ethers';
import {
  SupportedChainId,
  providerApiKeyToURL,
} from '@voltz-protocol/commons-v2';
import { getAlchemyApiKey, getInfuraApiKey } from './envVars';

export const getProvider = (
  chainId: SupportedChainId,
): providers.JsonRpcProvider => {
  const providerURL = providerApiKeyToURL(
    chainId,
    getAlchemyApiKey(),
    getInfuraApiKey(),
  );
  return new providers.JsonRpcProvider(providerURL);
};
