import { BigNumber, ethers, utils } from 'ethers';
import { abi as ProtocolABI } from './Protocol.json';
import { CRITICAL_ERROR_MESSAGE } from './constants';
import * as errorJson from './errorMapping.json';
import { ZERO_BN } from '../constants';

const iface = new ethers.utils.Interface(ProtocolABI);

const getErrorData = (error: any): string => {
  try {
    if (typeof error.error.error.data.data === 'string') {
      return error.error.error.data.data;
    }
  } catch (_) {}

  try {
    if (typeof error.error.data.originalError.data === 'string') {
      return error.error.data.originalError.data;
    }
  } catch (_) {}

  try {
    if (typeof error.error.data.data === 'string') {
      return error.error.data.data;
    }
  } catch (_) {}

  try {
    if (typeof error.data.data.data === 'string') {
      return error.data.data.data;
    }
  } catch (_) {}

  try {
    if (typeof error.data.data === 'string') {
      return error.data.data;
    }
  } catch (_) {}

  try {
    if (typeof error.error.data === 'string') {
      return error.error.data;
    }
  } catch (_) {}

  try {
    if (typeof error.data === 'string') {
      return error.data;
    }
  } catch (_) {}

  try {
    if (typeof error.errorSignature === 'string') {
      return iface.encodeErrorResult(error.errorSignature, error.errorArgs);
    }
  } catch (_) {}

  console.error(`Unknown error type. ${error}`);
  throw new Error(CRITICAL_ERROR_MESSAGE);
};

const getErrorSignature = (error: any): string => {
  const reason = getErrorData(error);

  try {
    if (reason.startsWith('0x08c379a0')) {
      return 'Error';
    }

    const decodedError = iface.parseError(reason);
    const errSig = decodedError.signature.split('(')[0];

    console.log('args:', decodedError.args);

    return errSig;
  } catch {
    console.error(`Failing to get error signature. ${error}`);
    throw new Error(CRITICAL_ERROR_MESSAGE);
  }
};

const getReadableErrorMessageWithoutSentry = (error: any): string => {
  const errSig = getErrorSignature(error);
  console.log(`Error signature: "${errSig}".`);

  if (errSig === 'Error') {
    const reason = getErrorData(error);

    try {
      // Remove the error signature
      const encodedMessage = reason.slice(0, 2).concat(reason.slice(10));

      const rawErrorMessage = utils.defaultAbiCoder.decode(
        ['string'],
        encodedMessage,
      )[0];

      if (Object.keys(errorJson).some((e) => e === rawErrorMessage)) {
        return errorJson[rawErrorMessage as keyof typeof errorJson];
      } else {
        console.log(`Raw error message: "${rawErrorMessage}".`);
      }
    } catch (_) {}

    return CRITICAL_ERROR_MESSAGE;
  }

  try {
    return errorJson[errSig as keyof typeof errorJson];
  } catch (_) {}

  console.log(`Unmapped error: ${errSig} with args: ${error.args}`);
  return CRITICAL_ERROR_MESSAGE;
};

export const getReadableErrorMessage = (error: any): string => {
  const message = getReadableErrorMessageWithoutSentry(error);
  return message;
};

export const decodeImFromError = (
  error: any,
): {
  marginRequirement: BigNumber;
} => {
  const errSig = getErrorSignature(error);
  if (errSig === 'AccountBelowIM') {
    const reason = getErrorData(error);
    const decodingResult = iface.decodeErrorResult(errSig, reason);

    return {
      marginRequirement: decodingResult.im,
    };
  }

  return {
    marginRequirement: ZERO_BN,
  };
};

export const decodeAnyErrorError = (error: any): any => {
  // Iterate through the event signatures in the ABI
  for (const abiError of ProtocolABI) {
    if (abiError.type === 'error') {
      // Attempt to decode the error response using the event signature
      try {
        if (!abiError.name) continue;
        const eventSignature = iface.getEvent(abiError.name);
        const decodedError = iface.decodeErrorResult(eventSignature, error);
        return decodedError;
      } catch (e) {
        // Failed to decode with this event signature, continue to the next one
        console.log('Decoding failed with signature:', abiError.name);
      }
    }
  }

  throw new Error(getReadableErrorMessage(error));
};

export type RawInfoPostSwap = {
  marginRequirement: BigNumber;
  tick: number;
  fee: BigNumber;
  availableNotional: BigNumber;
  fixedTokenDeltaUnbalanced: BigNumber;
  fixedTokenDelta: BigNumber;
};
