import { checkForTOSSignature } from './checkForTOSSignature';
import {
  getSignature,
  isMessageEIP1271Signed,
  saveSignatureWithTOS,
} from '../internal';

jest.mock('../internal', () => {
  return {
    getSignature: jest.fn().mockResolvedValue(null),
    getTOSText: jest.fn().mockReturnValue('This is the TOS text'),
    isMessageEIP1271Signed: jest.fn().mockResolvedValue(false),
    saveSignatureWithTOS: jest.fn().mockResolvedValue({ ok: true }),
  };
});

const mockSigner = {
  getAddress: jest.fn().mockResolvedValue('0x1234567890'),
  signMessage: jest.fn().mockResolvedValue('signed-message'),
};

describe('checkForTOSSignature', () => {
  it('throws an error if checkForTOSSignature throws error', async () => {
    (saveSignatureWithTOS as jest.Mock).mockRejectedValue('Error happened');
    await expect(
      checkForTOSSignature({ signer: mockSigner as never, sandbox: true }),
    ).rejects.toThrow('Error processing signature');
  });

  it('does not throw an error if the user signs the TOS', async () => {
    (isMessageEIP1271Signed as jest.Mock).mockResolvedValue(true);
    (getSignature as jest.Mock).mockResolvedValue({
      walletAddress: '0x1234567890',
      message: 'This is the TOS text',
    });
    await expect(
      checkForTOSSignature({ signer: mockSigner as never, sandbox: true }),
    ).resolves.not.toThrow();
  });
});
