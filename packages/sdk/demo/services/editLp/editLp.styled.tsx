import styled from '@emotion/styled';
import { colors } from 'brokoli-ui';

export const ContentBox = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const PageContentBox = styled('div')`
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid ${colors.lavenderWeb3};
  padding: 32px;
  border-radius: 20px;
  gap: 32px;
`;

export const ButtonBox = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
