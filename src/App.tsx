import React from 'react';

import { styled } from '@linaria/react';

import Map from './components/Map';
import Tracker from './components/Tracker';

const App: React.FC = () => {
  return (
    <Wrapper>
      <Map />
      <Tracker />
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.div`
  background-color: pink;
  height: 100%;
`;
