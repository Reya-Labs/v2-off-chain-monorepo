import { providers } from 'ethers';
import { getAlchemyApiKey, getInfuraApiKey } from './envVars';
import {
  SupportedChainId,
  providerApiKeyToURL,
} from '@voltz-protocol/commons-v2';

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
