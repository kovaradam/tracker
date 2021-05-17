import React from 'react';

import ReactIconsProvider from './ReactIconsProvider';

const Providers: React.FC = ({ children }) => {
  return <ReactIconsProvider>{children}</ReactIconsProvider>;
};

export default Providers;
