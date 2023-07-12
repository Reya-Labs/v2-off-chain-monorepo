import { providers } from 'ethers';
import { getAlchemyApiKey, getInfuraApiKey } from '../envVars';
import {
  SupportedChainId,
  providerApiKeyToURL,
} from '@voltz-protocol/commons-v2';

export const getProvider = (chainId: number): providers.JsonRpcProvider => {
  // todo: add check for chainId to be SupportedChainId
  const providerURL = providerApiKeyToURL(
    chainId as SupportedChainId,
    getAlchemyApiKey(),
    getInfuraApiKey(),
  );
  return new providers.JsonRpcProvider(providerURL);
};
