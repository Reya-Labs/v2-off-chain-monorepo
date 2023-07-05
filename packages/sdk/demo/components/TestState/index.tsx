import { RainbowLoader, Typography } from 'brokoli-ui';
import * as React from 'react';
import styled from '@emotion/styled';

const isError = (e: Error | never): e is Error => {
  return !!(e && e.stack && e.message);
};

const extractError = (err: unknown): string => {
  if (typeof err === 'string') {
    return err;
  }
  if (err instanceof Error || isError(err as never)) {
    return (err as Error).message;
  }
  return JSON.stringify(err, undefined, 2);
};

const TestResultBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const TestState: React.FunctionComponent<{
  error: unknown;
  loading: boolean;
  result: any;
}> = ({ error, loading, result }) => {
  return (
    <TestResultBox>
      {error ? (
        <Typography
          colorToken="wildStrawberry"
          typographyToken="primaryBodyMediumRegular"
        >
          {extractError(error)}
        </Typography>
      ) : null}
      {result ? (
        <Typography
          colorToken="skyBlueCrayola"
          typographyToken="primaryBodyMediumRegular"
        >
          {JSON.stringify(result, undefined, 2)}
        </Typography>
      ) : null}
      {loading ? <RainbowLoader height={2} text="Test in progress..." /> : null}
    </TestResultBox>
  );
};
