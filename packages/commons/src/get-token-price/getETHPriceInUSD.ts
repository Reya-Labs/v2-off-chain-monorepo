import axios from 'axios';
import { getCoingeckoApiKey } from '../env-vars';
import { CacheObject } from '../cache';

const ethPriceInUSD = new CacheObject<number>(60_000);

export const getETHPriceInUSD = async (): Promise<number> => {
  if (ethPriceInUSD.isCacheValid()) {
    return ethPriceInUSD.read();
  }

  try {
    const apiKey = getCoingeckoApiKey();
    const url = `https://pro-api.coingecko.com/api/v3/simple/price?x_cg_pro_api_key=${apiKey}&ids=ethereum&vs_currencies=usd`;

    const data = await axios.get(url);

    if (data && data.data && data.data.ethereum && data.data.ethereum.usd) {
      const price = data.data.ethereum.usd as number;
      ethPriceInUSD.update(price);

      return price;
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.log(
      `Failed fetching ETH price with reason: ${(error as Error).message}`,
    );

    return 0;
  }
};
