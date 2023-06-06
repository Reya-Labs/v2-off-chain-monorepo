import { PositionInfo } from "./type";
import axios from 'axios';
import {getServiceUrl} from "../urls";
import {AxiosResponse} from "axios";

export const getPositionInfo = async (positionId: string): Promise<PositionInfo> => {

  const baseUrl = getServiceUrl('portfolio-position-details');
  const url = `${baseUrl}/${positionId.toLowerCase()}`;

  const res = await axios.get<PositionInfo>(url, {
    withCredentials: false,
  });

  const positionInfo: PositionInfo = res.data;

  return positionInfo;

}