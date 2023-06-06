import { PositionInfo } from "./type";
import axios from 'axios';
import {getServiceUrl} from "../urls";

export const getPositionInfo = async (positionId: string): Promise<PositionInfo> => {

  const baseUrl = getServiceUrl('portfolio-position-details');
  const url = `${baseUrl}/${positionId.toLowerCase()}`;

  const res = await axios.get<PositionInfo>(url, {
    withCredentials: false,
  });

  return res.data;

}