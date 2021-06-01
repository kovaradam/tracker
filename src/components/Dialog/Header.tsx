import React from 'react';

import { styled } from '@linaria/react';

const Header: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Header;

const Wrapper = styled.header`
  font-size: 2rem;
  display: flex;
  align-content: center;
  padding: 1rem;
  color: #bbb8b8;
`;
