import { BigNumber } from 'ethers';
import { BaseEvent } from '../../src/event-parsers/types';

const EPSILON = 1e-5;

export const compareEvents = <T extends BaseEvent>(
  output: T,
  expected: T,
): string | null => {
  for (const key of Object.keys(output)) {
    const outputValue = output[key as keyof typeof output];
    const expectedValue = expected[key as keyof typeof expected];

    switch (typeof outputValue) {
      case 'number': {
        if (!(typeof expectedValue === 'number')) {
          return `Types do not match at ${key}: Expected ${typeof expectedValue} but received ${typeof outputValue}`;
        }

        if (Math.abs(outputValue - expectedValue) > EPSILON) {
          return `Values do not match at ${key}: Expected ${expectedValue} but received ${outputValue}`;
        }
        break;
      }
      case 'string': {
        if (!(typeof expectedValue === 'string')) {
          return `Types do not match at ${key}: Expected ${typeof expectedValue} but received ${typeof outputValue}`;
        }

        if (!(outputValue === expectedValue)) {
          return `Values do not match at ${key}: Expected ${expectedValue} but received ${outputValue}`;
        }
        break;
      }
      default: {
        throw new Error(`Unsupported type ${typeof outputValue}`);
      }
    }
  }

  return null;
};
