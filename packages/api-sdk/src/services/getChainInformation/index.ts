import { API_URL } from '../../constants';
import { ChainInformation } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetChainInformationArgs = {
  chainIds: number[];
};
export const getChainInformation = async ({
  chainIds,
}: GetChainInformationArgs): Promise<ChainInformation> => {
  const endpoint = `chain-information/${chainIds.join('&')}`;

  const response = await fetch(`${API_URL}${endpoint}`);

  return (await response.json()) as ChainInformation;
};
