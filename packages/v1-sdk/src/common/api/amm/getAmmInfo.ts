import { V1V2Pool } from '@voltz-protocol/api-v2-types';
import { API_URL } from '../urls';
import { AMMInfo } from './types';
import axios from 'axios';

export const getAmmInfo = async (ammId: string): Promise<AMMInfo> => {
  const url = `${API_URL}/v1v2-pool/${ammId}`;

  const res = await axios.get<V1V2Pool>(url, {
    withCredentials: false,
  });

  const rawAMM = res.data;

  const ammInfo: AMMInfo = {
    isEth: rawAMM.underlyingToken.name === 'eth',
    marginEngineAddress: rawAMM.marginEngineAddress,
    underlyingTokenDecimals: rawAMM.underlyingToken.tokenDecimals,
    underlyingTokenAddress: rawAMM.underlyingToken.address,
  };

  return ammInfo;
};
