import { STAGING_SERVICE_URL, UNAVAILABLE_TEXT } from '../constants';
import { getSignature, SignatureResponse } from './getSignature';

jest.mock('isomorphic-fetch', () => jest.fn());

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockFetch = require('isomorphic-fetch') as jest.Mock;

const mockSignatureResponse: SignatureResponse = {
  signature: 'signed-message',
  timestamp: '2022-01-01',
  walletAddress: '0x1234567890',
  message: 'This is the TOS text',
};

const serviceUrl = STAGING_SERVICE_URL;

describe('getSignature', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    jest.resetAllMocks();
  });

  it('retrieves signature data successfully', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSignatureResponse),
    });
    const result = await getSignature('0x1234567890', serviceUrl);
    expect(result).toEqual(mockSignatureResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${serviceUrl}/get-signature/0x1234567890`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('throws error when response is not ok', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(getSignature('0x1234567890', serviceUrl)).rejects.toThrow(
      UNAVAILABLE_TEXT,
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${serviceUrl}/get-signature/0x1234567890`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('throws error when 404 status code is returned', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const result = await getSignature('0x1234567890', serviceUrl);
    expect(result).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      `${serviceUrl}/get-signature/0x1234567890`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('throws error and captures exception when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('fetch failed'));
    await expect(getSignature('0x1234567890', serviceUrl)).rejects.toThrow(
      UNAVAILABLE_TEXT,
    );
  });
});
