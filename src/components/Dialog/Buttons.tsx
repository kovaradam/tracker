import { styled } from '@linaria/react';

export const Button = styled.button`
  &:active {
    background-color: #f5f5f5;
  }
`;

export const ActionButton = styled(Button)`
  font-size: 1.2rem;
  padding: 0.8rem 0;
  box-sizing: border-box;
  border: 0px solid #bbb8b842;
  border-top-width: 1px;
`;
