import fetch from 'isomorphic-fetch';

import { PRODUCTION_SERVICE_URL, STAGING_SERVICE_URL } from '../constants';

const cached: Record<string, string> = {};

export const getReferrerCode = async (account: string, sandbox: boolean) => {
  let serviceUrl = PRODUCTION_SERVICE_URL;
  if (sandbox) {
    serviceUrl = STAGING_SERVICE_URL;
  }
  if (!serviceUrl || !account) {
    return undefined;
  }
  if (cached[account]) {
    return cached[account];
  }

  try {
    const response = await fetch(`${serviceUrl}/get-refers-with/${account}`);

    if (!response.ok) {
      throw response;
    }
    const data = (await response.json()) as {
      status?: string;
      description?: string;
      refers_with_code?: string;
      wallet_address?: string;
    };
    if (!data?.refers_with_code) {
      return undefined;
    }
    const code = data.refers_with_code;
    cached[account] = code;
    return code;
  } catch (error) {
    return undefined;
  }
};
