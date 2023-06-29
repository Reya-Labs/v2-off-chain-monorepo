import * as React from 'react';
import { Button, Typography } from 'brokoli-ui';
import { TestState } from '../TestState';
import { ButtonBox, PageContentBox } from './TestPage.styled';

type TestPageProps = {
  error: unknown;
  loading: boolean;
  result: string;
  title: string;
  onTestClick: () => void;
};

export const TestPage: React.FC<TestPageProps> = ({
  loading,
  error,
  result,
  onTestClick,
  title,
}) => {
  return (
    <PageContentBox>
      <Typography
        colorToken="lavenderWeb"
        typographyToken="primaryHeader1Black"
      >
        {title}
      </Typography>
      <TestState loading={loading} error={error} result={result} />
      <ButtonBox>
        <Button variant="primary" onClick={onTestClick}>
          Test
        </Button>
      </ButtonBox>
    </PageContentBox>
  );
};
