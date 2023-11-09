import fetch from 'isomorphic-fetch';

type SaveSignatureWithTOSParams = {
  walletAddress: string;
  signature: string;
  termsOfService: string;
  referralCode?: string | null;
  serviceUrl: string;
};

/**
 * Saves a signature via the signatures API for the given wallet address.
 *
 * @param {SaveSignatureWithTOSParams} params - The parameters for saving the signature.
 * @param {string} params.walletAddress - The user's wallet address.
 * @param {string} params.signature - The signature of the terms of service.
 * @param {string} params.termsOfService - The terms of service that the user is agreeing to.
 * @param {string | null} params.referralCode - (Optional) The referral code of the user who referred the user.
 * @param {string} params.serviceUrl - The service URL.
 * @returns {Promise<Response>} A promise that resolves when the operation is complete.
 */
export const saveSignatureWithTOS = async ({
  walletAddress,
  signature,
  termsOfService,
  referralCode,
  serviceUrl,
}: SaveSignatureWithTOSParams): Promise<Response> => {
  // Build formData object.
  const formData = new FormData();
  formData.append('signature', signature);
  formData.append('walletAddress', walletAddress);
  formData.append('message', termsOfService);
  referralCode && formData.append('referralCode', referralCode);

  return await fetch(`${serviceUrl}/add-signature`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    body: formData,
  });
};
