import { saveSignatureWithTOS } from './saveSignatureWithTOS';
import { STAGING_SERVICE_URL } from '../constants';

jest.mock('isomorphic-fetch', () => jest.fn());
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockFetch = require('isomorphic-fetch') as jest.Mock;

const serviceUrl = STAGING_SERVICE_URL;

describe('saveSignatureWithTOS', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    jest.resetAllMocks();
  });

  it('should make a POST request to the correct URL', async () => {
    const walletAddress = '0x123...';
    const signature = 'signature';
    const termsOfService = 'terms of service';
    const referralCode = 'referralCode';
    await saveSignatureWithTOS({
      walletAddress: walletAddress,
      signature: signature,
      termsOfService: termsOfService,
      referralCode: referralCode,
      serviceUrl,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${serviceUrl}/add-signature`,
      expect.any(Object),
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should include the correct form data in the request', async () => {
    const walletAddress = '0x123...';
    const signature = 'signature';
    const termsOfService = 'terms of service';
    const referralCode = 'referralCode';
    await saveSignatureWithTOS({
      walletAddress: walletAddress,
      signature: signature,
      termsOfService: termsOfService,
      referralCode: referralCode,
      serviceUrl,
    });

    const formData = new FormData();
    formData.append('signature', signature);
    formData.append('walletAddress', walletAddress);
    formData.append('message', termsOfService);
    formData.append('referralCode', referralCode);

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      body: formData,
    });
  });

  it('should not include referralCode if referralCode is null', async () => {
    const walletAddress = '0x123...';
    const signature = 'signature';
    const termsOfService = 'terms of service';
    const referralCode = null;
    await saveSignatureWithTOS({
      walletAddress: walletAddress,
      signature: signature,
      termsOfService: termsOfService,
      referralCode: referralCode,
      serviceUrl,
    });

    const formData = new FormData();
    formData.append('signature', signature);
    formData.append('walletAddress', walletAddress);
    formData.append('message', termsOfService);

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      body: formData,
    });
  });

  it('should return the response from the server', async () => {
    // Mock the server response
    mockFetch.mockReturnValue(Promise.resolve({ ok: true }));

    // Call the function with some dummy data
    const walletAddress = '0x123...';
    const signature = 'signature';
    const termsOfService = 'terms of service';
    const referralCode = 'referralCode';

    // Get the response from the function
    const response = await saveSignatureWithTOS({
      walletAddress: walletAddress,
      signature: signature,
      termsOfService: termsOfService,
      referralCode: referralCode,
      serviceUrl,
    });

    // Assert that the response is equal to the server response
    expect(response).toEqual({
      ok: true,
    });
  });
});
