import { API_URL } from './constants';
import { ChainLevelInformation } from './types';
import fetch from 'isomorphic-fetch';

export const getChainLevelInformation = async (
  chainIds: number[],
): Promise<ChainLevelInformation> => {
  const endpoint = `chain-information/${chainIds.join('&')}`;

  const response = await fetch(`${API_URL}${endpoint}`);

  const result = (await response.json()) as ChainLevelInformation;
  return result;
};
