import axios from 'axios';


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

    const baseUrl = getServiceUrl('portfolio-positions');
    const url = `${baseUrl}/${chainIds.join('&')}/${ownerAddress.toLowerCase()}`;

    const res = await axios.get<PortfolioPosition[]>(url, {
      withCredentials: false,
    });

}