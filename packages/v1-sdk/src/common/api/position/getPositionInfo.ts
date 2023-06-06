import { PortfolioPositionDetails, PositionInfo } from "./types";
import axios from 'axios';
import {getServiceUrl} from "../urls";
import {AxiosResponse} from "axios";

const decodePositionId = (
  positionId: string,
): {
  chainId: number;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;
} => {
  const parts = positionId.split('_');

  return {
    chainId: Number(parts[0]),
    vammAddress: parts[1],
    ownerAddress: parts[2],
    tickLower: Number(parts[3]),
    tickUpper: Number(parts[4]),
  };
};

export const getPositionInfo = async (positionId: string): Promise<PositionInfo> => {

  const baseUrl = getServiceUrl('portfolio-position-details');
  const url = `${baseUrl}/${positionId.toLowerCase()}`;

  const res = await axios.get<PortfolioPositionDetails>(url, {
    withCredentials: false,
  });

  const portfolioPositionDetails: PortfolioPositionDetails = res.data;

  const {
    chainId,
    tickLower,
    tickUpper,
    ownerAddress,
  } = decodePositionId(portfolioPositionDetails.id);

  const positionInfo: PositionInfo = {
    positionTickLower: tickLower,
    positionTickUpper: tickUpper,
    ammUnderlyingTokenDecimals: portfolioPositionDetails.amm.underlyingToken.tokenDecimals,
    ammMarginEngineAddress: portfolioPositionDetails.amm.marginEngineAddress
  }


}