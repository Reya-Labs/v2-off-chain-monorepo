import { getServiceUrl } from '../urls';
import { RawAMM, AMMInfo } from './types';
import axios from 'axios';
import { SupportedChainId } from '../../types';

export const getAmmInfo = async (
  ammId: string,
  chainId: SupportedChainId,
): Promise<AMMInfo> => {
  // todo: refactor once api is adjusted to bake chain id into the ammId

  const baseUrl = getServiceUrl('pool');
  const url = `${baseUrl}/${chainId}/${ammId.toLowerCase()}`;

  const res = await axios.get<RawAMM>(url, {
    withCredentials: false,
  });

  const rawAMM: RawAMM = res.data;

  const ammInfo: AMMInfo = {
    isEth: rawAMM.tokenName === 'ETH',
    marginEngineAddress: rawAMM.marginEngine,
    underlyingTokenDecimals: rawAMM.tokenDecimals,
  };

  return ammInfo;
};
