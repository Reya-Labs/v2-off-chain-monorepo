import axios from 'axios';
import {getServiceUrl} from "../urls";

export type PositionInfo = {
  positionId: string;
  tickLower: number;
  tickUpper: number;
  underlyingTokenAddress: string;
  underlyingTokenDecimals: number;
  marginEngineAddress: string;
  positionOwnerAddress: string;
}

export const getPositionInfo = async (positionId: string): Promise<PositionInfo> => {

  const baseUrl = getServiceUrl('portfolio-position-details');
  const url = `${baseUrl}/${positionId.toLowerCase()}`;

  const res = await axios.get<PortfolioPositionDetails>(url, {
    withCredentials: false,
  });

  return res.data;

}