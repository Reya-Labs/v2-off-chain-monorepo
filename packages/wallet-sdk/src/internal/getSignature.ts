import fetch from 'isomorphic-fetch';
import { UNAVAILABLE_TEXT } from '../constants';

export type SignatureResponse = {
  signature?: string;
  timestamp?: string;
  walletAddress?: string;
  message?: string;
};

/**
 * Retrieves signature data via the signatures API for the given wallet address
 * @param walletAddress - the wallet address to retrieve the signature for
 * @param serviceUrl - the service url
 */
export const getSignature = async (
  walletAddress: string,
  serviceUrl: string,
) => {
  try {
    const resp = await fetch(`${serviceUrl}/get-signature/${walletAddress}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // https://voltz-rest-api.herokuapp.com//get-signature/0x45556408e543158f74403e882E3C8c23eCD9f732

    if (resp.ok) {
      return (await resp.json()) as SignatureResponse;
    } else if (resp.status === 404) {
      return undefined; // API is ok, but the signature wasn't found
    } else {
      throw await resp.text();
    }
  } catch (error) {
    // eslint-disable-next-line
    console.warn('TOS check failed', error);
    throw new Error(UNAVAILABLE_TEXT);
  }
};
