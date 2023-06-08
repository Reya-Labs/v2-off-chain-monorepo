import { getServiceUrl } from '../urls';
import { RawAMM, AMMInfo } from './types';
import { axios } from 'axios';

export const getAmmInfo = async (ammId: string): Promise<AMMInfo> => {
  const baseUrl = getServiceUrl('amm-details');
  const url = `${baseUrl}/${ammId.toLowerCase()}`;

  const res = await axios.get<RawAMM>(url, {
    withCredentials: false,
  });
};
